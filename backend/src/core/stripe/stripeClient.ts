/**
 * Stripe Client + Helpers — Madrassa App
 * Mode TEST par défaut · Stripe v22
 *
 * Plans:
 * - Starter: trial 30 jours (gratuit)
 * - Pro: base 10 classes + 8€/classe supplémentaire
 * - Institution: 199€/mois
 */
// Stripe v22 CommonJS style
// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require('stripe');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StripeInstance = any;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY not set — using placeholder');
}

export const stripe: StripeInstance = new StripeLib(
  process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
);

// ─── Price IDs (définis dans le Stripe Dashboard en mode Test) ──────────────
export const STRIPE_PRICES = {
  starter: null, // Gratuit — pas besoin d'un Price ID
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly_test',
  institution_monthly: process.env.STRIPE_PRICE_INSTITUTION_MONTHLY || 'price_institution_monthly_test',
  additional_class: process.env.STRIPE_PRICE_ADDITIONAL_CLASS || 'price_additional_class_test',
} as const;

export const PLAN_LIMITS = {
  starter: {
    baseClasses: 10,
    maxStudents: 150,
    features: ['notes', 'attendance', 'calendar', 'basic_reports'],
  },
  pro: {
    baseClasses: 10, // +8€/classe supplémentaire via metered billing
    maxStudents: -1, // illimité
    features: ['all_starter', 'invoicing', 'ai_assistant', 'advanced_reports', 'hr_management'],
  },
  institution: {
    baseClasses: -1, // illimité
    maxStudents: -1,
    features: ['all_pro', 'white_label', 'custom_domain', 'dedicated_support', 'api_access'],
  },
} as const;

/**
 * Créer ou récupérer un Customer Stripe pour un tenant
 */
export async function getOrCreateStripeCustomer(
  tenantId: string,
  email: string,
  name: string,
  existingCustomerId?: string | null
) {
  if (existingCustomerId) {
    return stripe.customers.retrieve(existingCustomerId);
  }
  return stripe.customers.create({ email, name, metadata: { tenantId } });
}

/**
 * Créer une session Checkout Stripe
 */
export async function createCheckoutSession({
  tenantId,
  plan,
  email,
  schoolName,
  successUrl,
  cancelUrl,
}: {
  tenantId: string;
  plan: 'pro' | 'institution';
  email: string;
  schoolName: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const priceId =
    plan === 'pro' ? STRIPE_PRICES.pro_monthly : STRIPE_PRICES.institution_monthly;

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { tenantId, plan, schoolName },
    },
    metadata: { tenantId, plan },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    locale: 'fr',
  });
}

/**
 * Calculer le montant mensuel d'un tenant (base + classes supplémentaires)
 */
export function calculateMonthlyTotal(
  plan: 'starter' | 'pro' | 'institution',
  additionalClasses = 0
): number {
  const basePrices = { starter: 0, pro: 49, institution: 199 };
  const base = basePrices[plan];
  const extras = Math.max(0, additionalClasses) * 8; // 8€/classe supplémentaire
  return base + extras;
}
