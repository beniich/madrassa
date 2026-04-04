/**
 * Routes Tenants — Onboarding, création d'école
 */
import { Router, Request, Response } from 'express';
import db from '../../db/index';
import { tenants, subscriptions } from '../../db/schema';
import { eq, count } from 'drizzle-orm';


const router = Router();

/**
 * POST /api/tenants
 * Créer un nouveau tenant (onboarding école)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, email, firebaseUid, primaryColor } = req.body;

    if (!name || !slug || !email) {
      return res.status(400).json({ error: 'name, slug et email requis' });
    }

    // Vérifier que le slug est unique
    const existing = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1);

    if (existing[0]) {
      return res.status(409).json({ error: 'Ce slug est déjà utilisé' });
    }

    // Créer le tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        firebaseUid,
        primaryColor: primaryColor || '#f59e0b',
      })
      .returning();

    // Créer un abonnement starter par défaut (trial 30 jours)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);

    await db.insert(subscriptions).values({
      tenantId: tenant.id,
      plan: 'starter',
      status: 'trialing',
      baseClassesIncluded: 10,
      additionalClassesCount: 0,
      pricePerAdditionalClass: '8.00',
      trialEndsAt: trialEnd,
    });

    res.status(201).json({
      success: true,
      tenant,
      message: 'Établissement créé. Essai de 30 jours activé.',
    });
  } catch (error) {
    console.error('[Tenants] create error:', error);
    res.status(500).json({ error: 'Erreur création tenant' });
  }
});

/**
 * GET /api/tenants/:slug
 * Récupérer les infos d'un tenant par son slug
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const result = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1);

    if (!result[0]) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération tenant' });
  }
});

/**
 * GET /api/tenants/:id/classes-usage
 * Retourner le quota de classes utilisé vs inclus
 */
router.get('/:id/classes-usage', async (req: Request, res: Response) => {
  try {
    const tenantId = String(req.params.id);
    const { classes } = await import('../../db/schema');

    const classCount = await db
      .select({ count: count() })
      .from(classes)
      .where(eq(classes.tenantId, tenantId));

    const subResult = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, tenantId))
      .limit(1);

    const sub = subResult[0];
    const totalClasses = Number(classCount[0]?.count || 0);
    const baseIncluded = sub?.baseClassesIncluded || 10;
    const additionalUsed = Math.max(0, totalClasses - baseIncluded);

    res.json({
      totalClasses,
      baseIncluded,
      additionalUsed,
      pricePerAdditional: 8,
      estimatedExtraCharge: additionalUsed * 8,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur usage classes' });
  }
});

export default router;
