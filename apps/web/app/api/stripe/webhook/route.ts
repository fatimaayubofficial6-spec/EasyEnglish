import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { SubscriptionStatus, SubscriptionTier } from "@/types/models";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  if (!stripe) {
    console.error("Stripe is not configured");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  try {
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    console.error(`User not found: ${userId}`);
    return;
  }

  user.stripeCustomerId = customerId;
  user.stripeSubscriptionId = subscriptionId;
  user.subscriptionTier = SubscriptionTier.PREMIUM;
  user.subscriptionStatus = SubscriptionStatus.ACTIVE;
  user.subscriptionStartDate = new Date();

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    user.stripePriceId = subscription.items.data[0]?.price.id;
    user.nextBillingDate = new Date(subscription.current_period_end * 1000);
  }

  await user.save();

  console.log(`Subscription activated for user ${userId}`);
  // TODO: Send welcome email
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  const user = await User.findOne({ stripeCustomerId: customerId });

  if (!user) {
    console.error(`User not found with customerId: ${customerId}`);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  user.subscriptionStatus = SubscriptionStatus.ACTIVE;
  user.subscriptionTier = SubscriptionTier.PREMIUM;
  user.nextBillingDate = new Date(subscription.current_period_end * 1000);

  await user.save();

  console.log(`Payment succeeded for user ${user._id}`);
  // TODO: Send payment confirmation email
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await User.findOne({ stripeCustomerId: customerId });

  if (!user) {
    console.error(`User not found with customerId: ${customerId}`);
    return;
  }

  console.log(`Payment failed for user ${user._id}`);
  // TODO: Send payment failed email with retry instructions
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await User.findOne({ stripeCustomerId: customerId });

  if (!user) {
    console.error(`User not found with customerId: ${customerId}`);
    return;
  }

  user.subscriptionStatus = SubscriptionStatus.CANCELED;
  user.subscriptionTier = SubscriptionTier.FREE;
  user.subscriptionEndDate = new Date(subscription.ended_at ? subscription.ended_at * 1000 : Date.now());
  user.stripeSubscriptionId = undefined;
  user.stripePriceId = undefined;
  user.nextBillingDate = undefined;

  await user.save();

  console.log(`Subscription canceled for user ${user._id}`);
  // TODO: Send cancellation confirmation email
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await User.findOne({ stripeCustomerId: customerId });

  if (!user) {
    console.error(`User not found with customerId: ${customerId}`);
    return;
  }

  if (subscription.status === "active") {
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;
    user.subscriptionTier = SubscriptionTier.PREMIUM;
    user.nextBillingDate = new Date(subscription.current_period_end * 1000);
  } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
    user.subscriptionStatus = SubscriptionStatus.CANCELED;
  } else if (subscription.status === "past_due") {
    // Keep as active but could add a "past_due" status if needed
    console.warn(`Subscription past due for user ${user._id}`);
  }

  user.stripePriceId = subscription.items.data[0]?.price.id;

  await user.save();

  console.log(`Subscription updated for user ${user._id}, status: ${subscription.status}`);
}
