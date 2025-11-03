import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    "Warning: STRIPE_SECRET_KEY is not set. Stripe functionality will be disabled. " +
    "Please set up Stripe environment variables to enable subscriptions."
  );
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    })
  : null;

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "";

if (!STRIPE_PRICE_ID && stripeSecretKey) {
  console.warn("Warning: STRIPE_PRICE_ID is not set. Stripe checkout will not work.");
}

export const isStripeConfigured = !!stripeSecretKey && !!STRIPE_PRICE_ID;
