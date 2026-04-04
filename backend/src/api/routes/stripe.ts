/**
 * Routes Stripe — Checkout, Portail, Webhook
 */
import { Router, Request, Response } from 'express';
import { createCheckoutSession, stripe, STRIPE_PRICES } from '../../core/stripe/stripeClient';
import { handleStripeWebhook } from '../../core/stripe/webhookHandler';
import db from '../../db/index';
import { subscriptions, tenants } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * POST /api/stripe/create-checkout-session
 * Crée une session Stripe Checkout pour upgrader un tenant
 */
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { tenantId, plan, email, schoolName } = req.body;

    if (!tenantId || !plan || !email) {
      return res.status(400).json({ error: 'tenantId, plan et email requis' });
    }

    if (!['pro', 'institution'].includes(plan)) {
      return res.status(400).json({ error: 'Plan invalide. Choisir: pro, institution' });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await createCheckoutSession({
      tenantId,
      plan,
      email,
      schoolName: schoolName || 'Mon École',
      successUrl: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?canceled=1`,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('[Stripe] create-checkout-session error:', error);
    res.status(500).json({ error: 'Erreur création session Stripe' });
  }
});

/**
 * POST /api/stripe/create-portal-session
 * Redirige vers le portail client Stripe (gérer factures, changer carte)
 */
router.post('/create-portal-session', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.body;

    const subResult = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, tenantId))
      .limit(1);

    const sub = subResult[0];
    if (!sub?.stripeCustomerId) {
      return res.status(404).json({ error: 'Pas de customer Stripe pour ce tenant' });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${baseUrl}/settings`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe] portal session error:', error);
    res.status(500).json({ error: 'Erreur portail Stripe' });
  }
});

/**
 * GET /api/stripe/subscription/:tenantId
 * Retourner l'état de l'abonnement d'un tenant
 */
router.get('/subscription/:tenantId', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const tenantIdStr = String(tenantId);
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, tenantIdStr))
      .limit(1);

    if (!result[0]) {
      return res.status(404).json({ error: 'Abonnement non trouvé' });
    }

    const sub = result[0];

    // Calcul des classes supplémentaires facturées
    const additionalClasses = sub.additionalClassesCount || 0;
    const pricePerExtra = parseFloat(sub.pricePerAdditionalClass || '15');
    const extraCharge = additionalClasses * pricePerExtra;

    res.json({
      ...sub,
      billing: {
        additionalClasses,
        pricePerClass: pricePerExtra,
        extraCharge,
        totalEstimated: extraCharge, // + base price depuis le Price ID Stripe
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération abonnement' });
  }
});

/**
 * POST /api/stripe/webhook
 * Endpoint Stripe Webhook (raw body requis)
 */
router.post('/webhook', handleStripeWebhook);

export default router;
