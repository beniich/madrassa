/**
 * Middleware Multitenant
 * Extrait le tenant depuis le JWT Firebase ou le header X-Tenant-ID
 * Injecte le contexte dans req pour les routes suivantes
 */
import { Request, Response, NextFunction } from 'express';
import db from '../../db/index';
import { tenants, subscriptions } from '../../db/schema';
import { eq } from 'drizzle-orm';

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  plan: string;
  isActive: boolean;
}

// Augmenter le type Request d'Express
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
      tenantId?: string;
    }
  }
}

/**
 * Middleware principal — résout le tenant depuis:
 * 1. Header X-Tenant-ID (UUID direct)
 * 2. Header X-Tenant-Slug (slug de l'école)
 * 3. Subdomain (madrassa-marseille.app.com → slug)
 */
export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Super admin bypass — pas de restriction tenant
    if (req.path.startsWith('/api/super-admin')) {
      return next();
    }

    // 1. Essayer X-Tenant-ID header direct
    let tenantId = req.headers['x-tenant-id'] as string;
    let tenant: typeof tenants.$inferSelect | undefined;

    if (tenantId) {
      const result = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantId))
        .limit(1);
      tenant = result[0];
    }

    // 2. Essayer X-Tenant-Slug header
    if (!tenant) {
      const slug = req.headers['x-tenant-slug'] as string;
      if (slug) {
        const result = await db
          .select()
          .from(tenants)
          .where(eq(tenants.slug, slug))
          .limit(1);
        tenant = result[0];
      }
    }

    // 3. Essayer subdomain (ex: school-abc.madrassa.app)
    if (!tenant) {
      const host = req.headers.host || '';
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        const result = await db
          .select()
          .from(tenants)
          .where(eq(tenants.slug, subdomain))
          .limit(1);
        tenant = result[0];
      }
    }

    if (!tenant) {
      // Routes publiques (health, auth, stripe webhooks) — pas de tenant requis
      if (
        req.path === '/api/health' ||
        req.path.startsWith('/api/auth') ||
        req.path.startsWith('/api/stripe/webhook') ||
        req.path.startsWith('/api/tenants')
      ) {
        return next();
      }

      return res.status(401).json({
        error: 'TENANT_NOT_FOUND',
        message: 'Tenant non identifié. Envoyez X-Tenant-ID ou X-Tenant-Slug.',
      });
    }

    if (!tenant.isActive) {
      return res.status(403).json({
        error: 'TENANT_SUSPENDED',
        message: 'Ce compte établissement a été suspendu.',
      });
    }

    // Récupérer l'abonnement
    const subResult = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, tenant.id))
      .limit(1);

    const subscription = subResult[0];

    // Injecter dans req
    req.tenant = {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      plan: subscription?.plan || 'starter',
      isActive: tenant.isActive ?? true,
    };
    req.tenantId = tenant.id;

    next();
  } catch (error) {
    console.error('[TenantMiddleware] Error:', error);
    res.status(500).json({ error: 'TENANT_RESOLUTION_ERROR' });
  }
}

/**
 * Middleware garde — vérifie qu'un tenant est présent (pour routes protégées)
 */
export function requireTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.tenant) {
    return res.status(401).json({
      error: 'NO_TENANT',
      message: 'Authentification tenant requise.',
    });
  }
  next();
}
