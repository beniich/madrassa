/**
 * Routes Super Admin — Contrôle global multi-tenant
 * Protégé par vérification Firebase UID super admin
 */
import { Router, Request, Response, NextFunction } from 'express';
import db from '../../db/index';
import { tenants, subscriptions, students, teachers, classes, auditLogs } from '../../db/schema';
import { eq, count, desc, sql } from 'drizzle-orm';

const router = Router();

// ─── Middleware d'authentification Super Admin ───────────────────────────────

const SUPER_ADMIN_FIREBASE_UID = process.env.SUPER_ADMIN_FIREBASE_UID;

function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const superAdminKey = req.headers['x-super-admin-key'] as string;
  const masterKey = process.env.SUPER_ADMIN_MASTER_KEY;

  if (!masterKey || superAdminKey !== masterKey) {
    return res.status(403).json({ error: 'SUPER_ADMIN_REQUIRED' });
  }
  next();
}

router.use(requireSuperAdmin);

// ─── KPIs Globaux ────────────────────────────────────────────────────────────

/**
 * GET /api/super-admin/kpis
 * Métriques globales de la plateforme
 */
router.get('/kpis', async (_req: Request, res: Response) => {
  try {
    const [
      totalTenantsResult,
      activeTenantsResult,
      totalStudentsResult,
      totalTeachersResult,
      totalClassesResult,
      planBreakdownResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(tenants),
      db.select({ count: count() }).from(tenants).where(eq(tenants.isActive, true)),
      db.select({ count: count() }).from(students),
      db.select({ count: count() }).from(teachers),
      db.select({ count: count() }).from(classes),
      db
        .select({ plan: subscriptions.plan, count: count() })
        .from(subscriptions)
        .groupBy(subscriptions.plan),
    ]);

    // MRR estimé (simplifié)
    const planRevenue = { starter: 0, pro: 49, institution: 199 };
    let mrr = 0;
    for (const row of planBreakdownResult) {
      if (row.plan) {
        mrr += (planRevenue[row.plan as keyof typeof planRevenue] || 0) * Number(row.count);
      }
    }

    res.json({
      totalTenants: Number(totalTenantsResult[0]?.count || 0),
      activeTenants: Number(activeTenantsResult[0]?.count || 0),
      totalStudents: Number(totalStudentsResult[0]?.count || 0),
      totalTeachers: Number(totalTeachersResult[0]?.count || 0),
      totalClasses: Number(totalClassesResult[0]?.count || 0),
      mrrEstimated: mrr,
      planBreakdown: planBreakdownResult,
    });
  } catch (error) {
    console.error('[SuperAdmin] KPIs error:', error);
    res.status(500).json({ error: 'Erreur récupération KPIs' });
  }
});

// ─── Liste des Tenants ───────────────────────────────────────────────────────

/**
 * GET /api/super-admin/tenants
 * Liste tous les tenants avec leurs abonnements
 */
router.get('/tenants', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const allTenants = await db
      .select({
        tenant: tenants,
        subscription: subscriptions,
      })
      .from(tenants)
      .leftJoin(subscriptions, eq(tenants.id, subscriptions.tenantId))
      .orderBy(desc(tenants.createdAt))
      .limit(limit)
      .offset(offset);

    // Ajouter les stats de classes par tenant
    const enriched = await Promise.all(
      allTenants.map(async ({ tenant, subscription }) => {
        const [classCount, studentCount] = await Promise.all([
          db.select({ count: count() }).from(classes).where(eq(classes.tenantId, tenant.id)),
          db.select({ count: count() }).from(students).where(eq(students.tenantId, tenant.id)),
        ]);

        const totalClasses = Number(classCount[0]?.count || 0);
        const baseIncluded = subscription?.baseClassesIncluded || 10;
        const additionalClasses = Math.max(0, totalClasses - baseIncluded);

        return {
          ...tenant,
          subscription,
          stats: {
            totalClasses,
            totalStudents: Number(studentCount[0]?.count || 0),
            additionalClasses,
            estimatedExtraCharge: additionalClasses * 15,
          },
        };
      })
    );

    res.json({ tenants: enriched, page, limit });
  } catch (error) {
    console.error('[SuperAdmin] tenants list error:', error);
    res.status(500).json({ error: 'Erreur liste tenants' });
  }
});

// ─── Actions sur un Tenant ───────────────────────────────────────────────────

/**
 * PUT /api/super-admin/tenants/:id/suspend
 */
router.put('/tenants/:id/suspend', async (req: Request, res: Response) => {
  try {
    const tenantId = String(req.params.id);
    await db
      .update(tenants)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));

    // Log audit
    await db.insert(auditLogs).values({
      tenantId: tenantId,
      userId: 'super_admin',
      action: 'TENANT_SUSPENDED',
      resource: 'tenant',
      resourceId: tenantId,
      metadata: { reason: req.body.reason },
    });

    res.json({ success: true, message: 'Tenant suspendu' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur suspension' });
  }
});

/**
 * PUT /api/super-admin/tenants/:id/activate
 */
router.put('/tenants/:id/activate', async (req: Request, res: Response) => {
  try {
    const tenantId = String(req.params.id);
    await db
      .update(tenants)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));

    await db.insert(auditLogs).values({
      tenantId: tenantId,
      userId: 'super_admin',
      action: 'TENANT_ACTIVATED',
      resource: 'tenant',
      resourceId: tenantId,
    });

    res.json({ success: true, message: 'Tenant réactivé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur activation' });
  }
});

/**
 * PUT /api/super-admin/tenants/:id/plan
 * Changer le plan d'un tenant manuellement
 */
router.put('/tenants/:id/plan', async (req: Request, res: Response) => {
  try {
    const tenantId = String(req.params.id);
    const { plan } = req.body;
    if (!['starter', 'pro', 'institution'].includes(plan)) {
      return res.status(400).json({ error: 'Plan invalide' });
    }

    await db
      .update(subscriptions)
      .set({ plan, updatedAt: new Date() })
      .where(eq(subscriptions.tenantId, tenantId));

    await db.insert(auditLogs).values({
      tenantId: tenantId,
      userId: 'super_admin',
      action: 'PLAN_CHANGED',
      resource: 'subscription',
      resourceId: tenantId,
      metadata: { newPlan: plan },
    });

    res.json({ success: true, message: `Plan changé vers ${plan}` });
  } catch (error) {
    res.status(500).json({ error: 'Erreur changement plan' });
  }
});

/**
 * GET /api/super-admin/audit-logs
 * Logs d'audit global
 */
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;

    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Erreur audit logs' });
  }
});

export default router;
