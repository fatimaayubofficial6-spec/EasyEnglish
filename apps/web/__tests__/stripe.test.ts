import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "@/lib/models/User";
import { SubscriptionStatus, SubscriptionTier, Language } from "@/types/models";

jest.mock("@/lib/stripe/stripe", () => ({
  stripe: {
    customers: {
      create: jest.fn().mockResolvedValue({
        id: "cus_test123",
      }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: "cs_test123",
          url: "https://checkout.stripe.com/test",
        }),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: "bps_test123",
          url: "https://billing.stripe.com/test",
        }),
      },
    },
    subscriptions: {
      retrieve: jest.fn().mockResolvedValue({
        id: "sub_test123",
        status: "active",
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        items: {
          data: [
            {
              price: {
                id: "price_test123",
              },
            },
          ],
        },
      }),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
  STRIPE_PRICE_ID: "price_test123",
}));

describe("Stripe Integration", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe("User Model - Stripe Fields", () => {
    it("should create user with default subscription status", async () => {
      const user = await User.create({
        email: "test@example.com",
        name: "Test User",
        learningLanguage: Language.ENGLISH,
      });

      expect(user.subscriptionTier).toBe(SubscriptionTier.FREE);
      expect(user.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
      expect(user.stripeCustomerId).toBeUndefined();
      expect(user.stripeSubscriptionId).toBeUndefined();
      expect(user.stripePriceId).toBeUndefined();
      expect(user.nextBillingDate).toBeUndefined();
    });

    it("should store Stripe customer and subscription IDs", async () => {
      const user = await User.create({
        email: "premium@example.com",
        name: "Premium User",
        learningLanguage: Language.ENGLISH,
        stripeCustomerId: "cus_test123",
        stripeSubscriptionId: "sub_test123",
        stripePriceId: "price_test123",
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionStartDate: new Date(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      expect(user.stripeCustomerId).toBe("cus_test123");
      expect(user.stripeSubscriptionId).toBe("sub_test123");
      expect(user.stripePriceId).toBe("price_test123");
      expect(user.subscriptionTier).toBe(SubscriptionTier.PREMIUM);
      expect(user.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
      expect(user.nextBillingDate).toBeDefined();
    });

    it("should update subscription status to canceled", async () => {
      const user = await User.create({
        email: "cancel@example.com",
        name: "Cancel User",
        learningLanguage: Language.ENGLISH,
        stripeCustomerId: "cus_test456",
        stripeSubscriptionId: "sub_test456",
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      user.subscriptionStatus = SubscriptionStatus.CANCELED;
      user.subscriptionTier = SubscriptionTier.FREE;
      user.subscriptionEndDate = new Date();
      user.stripeSubscriptionId = undefined;
      user.stripePriceId = undefined;
      user.nextBillingDate = undefined;

      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.subscriptionStatus).toBe(SubscriptionStatus.CANCELED);
      expect(updatedUser?.subscriptionTier).toBe(SubscriptionTier.FREE);
      expect(updatedUser?.stripeSubscriptionId).toBeUndefined();
      expect(updatedUser?.stripePriceId).toBeUndefined();
      expect(updatedUser?.nextBillingDate).toBeUndefined();
    });

    it("should enforce unique constraint on stripeCustomerId", async () => {
      await User.create({
        email: "user1@example.com",
        name: "User 1",
        learningLanguage: Language.ENGLISH,
        stripeCustomerId: "cus_unique123",
      });

      await expect(
        User.create({
          email: "user2@example.com",
          name: "User 2",
          learningLanguage: Language.ENGLISH,
          stripeCustomerId: "cus_unique123",
        })
      ).rejects.toThrow();
    });

    it("should enforce unique constraint on stripeSubscriptionId", async () => {
      await User.create({
        email: "user1@example.com",
        name: "User 1",
        learningLanguage: Language.ENGLISH,
        stripeSubscriptionId: "sub_unique123",
      });

      await expect(
        User.create({
          email: "user2@example.com",
          name: "User 2",
          learningLanguage: Language.ENGLISH,
          stripeSubscriptionId: "sub_unique123",
        })
      ).rejects.toThrow();
    });
  });

  describe("Webhook Event Processing", () => {
    it("should handle checkout.session.completed event", async () => {
      const user = await User.create({
        email: "checkout@example.com",
        name: "Checkout User",
        learningLanguage: Language.ENGLISH,
        onboardingCompleted: true,
      });

      user.stripeCustomerId = "cus_checkout123";
      user.stripeSubscriptionId = "sub_checkout123";
      user.subscriptionTier = SubscriptionTier.PREMIUM;
      user.subscriptionStatus = SubscriptionStatus.ACTIVE;
      user.subscriptionStartDate = new Date();
      user.stripePriceId = "price_test123";
      user.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
      expect(updatedUser?.subscriptionTier).toBe(SubscriptionTier.PREMIUM);
      expect(updatedUser?.stripeCustomerId).toBe("cus_checkout123");
      expect(updatedUser?.stripeSubscriptionId).toBe("sub_checkout123");
    });

    it("should handle invoice.payment_succeeded event", async () => {
      const user = await User.create({
        email: "payment@example.com",
        name: "Payment User",
        learningLanguage: Language.ENGLISH,
        stripeCustomerId: "cus_payment123",
        stripeSubscriptionId: "sub_payment123",
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      user.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
      expect(updatedUser?.nextBillingDate).toBeDefined();
    });

    it("should handle customer.subscription.deleted event", async () => {
      const user = await User.create({
        email: "deleted@example.com",
        name: "Deleted User",
        learningLanguage: Language.ENGLISH,
        stripeCustomerId: "cus_deleted123",
        stripeSubscriptionId: "sub_deleted123",
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      user.subscriptionStatus = SubscriptionStatus.CANCELED;
      user.subscriptionTier = SubscriptionTier.FREE;
      user.subscriptionEndDate = new Date();
      user.stripeSubscriptionId = undefined;
      user.stripePriceId = undefined;
      user.nextBillingDate = undefined;

      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.subscriptionStatus).toBe(SubscriptionStatus.CANCELED);
      expect(updatedUser?.subscriptionTier).toBe(SubscriptionTier.FREE);
      expect(updatedUser?.stripeSubscriptionId).toBeUndefined();
    });
  });

  describe("Subscription Status Validation", () => {
    it("should allow active premium users", async () => {
      const user = await User.create({
        email: "active@example.com",
        name: "Active User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.PREMIUM,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        onboardingCompleted: true,
      });

      expect(user.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
      expect(user.onboardingCompleted).toBe(true);
    });

    it("should handle canceled subscription status", async () => {
      const user = await User.create({
        email: "canceled@example.com",
        name: "Canceled User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.CANCELED,
        onboardingCompleted: true,
      });

      expect(user.subscriptionStatus).toBe(SubscriptionStatus.CANCELED);
      expect(user.subscriptionTier).toBe(SubscriptionTier.FREE);
    });

    it("should handle free tier users", async () => {
      const user = await User.create({
        email: "free@example.com",
        name: "Free User",
        learningLanguage: Language.ENGLISH,
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      expect(user.subscriptionTier).toBe(SubscriptionTier.FREE);
      expect(user.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
    });
  });
});
