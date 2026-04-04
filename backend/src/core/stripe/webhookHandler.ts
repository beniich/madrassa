/**
 * Stripe Webhook Handler
 * Écoute les événements Stripe et met à jour la DB en conséquence
 */
import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require('stripe');
import { stripe } from './stripeClient';
import db from '../../db/index';
import { subscriptions, tenants } from '../../db/schema';
import { eq } from 'drizzle-orm';

type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  console.log(`[Stripe Webhook] Event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await updateSubscriptionInDb(sub);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await cancelSubscriptionInDb(sub);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handlePaymentSuccess(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCheckoutComplete(session: any) {
  const { tenantId, plan } = session.metadata || {};
  if (!tenantId || !plan) return;

  const stripeSubId = session.subscription as string;
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);

  await db
    .update(subscriptions)
    .set({
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: stripeSubId,
      stripePriceId: stripeSub.items.data[0]?.price.id,
      plan: plan as any,
      status: mapStripeStatus(stripeSub.status),
      trialEndsAt: stripeSub.trial_end
        ? new Date(stripeSub.trial_end * 1000)
        : null,
      currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.tenantId, tenantId));

  console.log(`[Stripe] Tenant ${tenantId} upgraded to ${plan}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateSubscriptionInDb(stripeSub: any) {
  const tenantId = stripeSub.metadata?.tenantId;
  if (!tenantId) return;

  await db
    .update(subscriptions)
    .set({
      status: mapStripeStatus(stripeSub.status),
      currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      canceledAt: stripeSub.canceled_at
        ? new Date(stripeSub.canceled_at * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cancelSubscriptionInDb(stripeSub: any) {
  const tenantId = stripeSub.metadata?.tenantId;
  if (!tenantId) return;

  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id));

  // Désactiver le tenant
  await db
    .update(tenants)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));

  console.log(`[Stripe] Tenant ${tenantId} subscription canceled`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePaymentSuccess(invoice: any) {
  if (!invoice.subscription) return;
  await db
    .update(subscriptions)
    .set({ status: 'active', updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription as string));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePaymentFailed(invoice: any) {
  if (!invoice.subscription) return;
  await db
    .update(subscriptions)
    .set({ status: 'past_due', updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription as string));
}

function mapStripeStatus(status: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'unpaid',
    incomplete: 'unpaid',
    incomplete_expired: 'canceled',
    paused: 'past_due',
  };
  return map[status] || 'unpaid';
}
