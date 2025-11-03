# MongoDB Models Documentation

This document provides comprehensive documentation for all MongoDB models using Mongoose in the EasyEnglish application.

## Table of Contents

- [Setup and Connection](#setup-and-connection)
- [Models Overview](#models-overview)
- [User Model](#user-model)
- [Paragraph Model](#paragraph-model)
- [TranslationCache Model](#translationcache-model)
- [ExerciseAttempt Model](#exerciseattempt-model)
- [AdminUser Model](#adminuser-model)
- [Helper Functions](#helper-functions)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Setup and Connection

### Connection Utility

The application uses a singleton connection pattern optimized for serverless environments:

```typescript
import connectDB from "@/lib/db/mongoose";

// Always call connectDB before database operations
await connectDB();
```

**Features:**
- Singleton pattern prevents duplicate connections
- Caches connection in global scope for hot reloading in development
- Handles serverless environment constraints
- Automatic reconnection on connection loss

**Environment Variable:**
```env
DATABASE_URL=mongodb://localhost:27017/easyenglish
# or MongoDB Atlas
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/easyenglish
```

## Models Overview

| Model | Collection | Purpose |
|-------|-----------|---------|
| User | users | Extended user data with subscription and language preferences |
| Paragraph | paragraphs | Exercise content with difficulty and metadata |
| TranslationCache | translationcaches | Cached translations to reduce API calls |
| ExerciseAttempt | exerciseattempts | User exercise submissions and scores |
| AdminUser | adminusers | Admin roles and permissions |

## User Model

**Location:** `lib/models/User.ts`

### Schema

```typescript
{
  email: String (required, unique, lowercase, validated)
  name: String (optional)
  image: String (optional)
  googleId: String (unique, sparse)
  nativeLanguage: Language (enum, optional)
  learningLanguage: Language (enum, required, default: "en")
  subscriptionTier: SubscriptionTier (enum, required, default: "free")
  subscriptionStatus: SubscriptionStatus (enum, required, default: "active")
  subscriptionStartDate: Date (optional)
  subscriptionEndDate: Date (optional)
  stripeCustomerId: String (unique, sparse)
  onboardingCompleted: Boolean (required, default: false)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Enums

**SubscriptionTier:**
- `free` - Free tier with basic features
- `premium` - Premium tier with advanced features
- `enterprise` - Enterprise tier with full features

**SubscriptionStatus:**
- `active` - Subscription is active
- `canceled` - Subscription canceled but still active until end date
- `expired` - Subscription has expired
- `trial` - Trial period

**Language:**
- `en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `zh`, `ja`, `ko`

### Indexes

- `{ subscriptionTier: 1, subscriptionStatus: 1 }` - Query subscriptions
- `{ createdAt: -1 }` - Recently joined users
- `{ email: 1 }` - Unique constraint (automatic)
- `{ googleId: 1 }` - Unique constraint (automatic, sparse)

### Validations

- Email must be valid format (regex)
- Email is unique and case-insensitive
- GoogleId is unique but allows multiple null values (sparse index)
- SubscriptionTier, SubscriptionStatus, and Language must be valid enum values

### Usage Example

```typescript
import { User } from "@/lib/models";
import connectDB from "@/lib/db/mongoose";

await connectDB();

const user = await User.create({
  email: "user@example.com",
  name: "John Doe",
  googleId: "google123",
  learningLanguage: "en",
});
```

## Paragraph Model

**Location:** `lib/models/Paragraph.ts`

### Schema

```typescript
{
  title: String (required, max 200 chars)
  content: String (required, min 50 chars)
  difficulty: DifficultyLevel (enum, required)
  language: Language (enum, required, default: "en")
  topics: [String] (array, max 10 items, default: [])
  wordCount: Number (auto-calculated, min: 0)
  isActive: Boolean (required, default: true)
  metadata: {
    source: String (optional)
    author: String (optional)
    publicationDate: Date (optional)
  }
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Enums

**DifficultyLevel:**
- `beginner` - Easy content for beginners
- `intermediate` - Medium difficulty content
- `advanced` - Complex content for advanced learners

### Indexes

- `{ difficulty: 1, language: 1, isActive: 1 }` - Query active paragraphs by filters
- `{ topics: 1 }` - Query by topic
- `{ wordCount: 1 }` - Query by length
- `{ createdAt: -1 }` - Recently added content

### Validations

- Title: required, max 200 characters
- Content: required, min 50 characters
- Topics: max 10 items
- WordCount: auto-calculated, non-negative

### Pre-save Hook

Automatically calculates word count from content:

```typescript
ParagraphSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.wordCount = this.content.split(/\s+/).filter((word) => word.length > 0).length;
  }
  next();
});
```

### Usage Example

```typescript
import { Paragraph } from "@/lib/models";
import { DifficultyLevel, Language } from "@/types/models";

const paragraph = await Paragraph.create({
  title: "Benefits of Exercise",
  content: "Regular exercise provides numerous health benefits...",
  difficulty: DifficultyLevel.BEGINNER,
  language: Language.ENGLISH,
  topics: ["health", "fitness"],
});

console.log(paragraph.wordCount); // Auto-calculated
```

## TranslationCache Model

**Location:** `lib/models/TranslationCache.ts`

### Schema

```typescript
{
  text: String (required)
  sourceLang: Language (enum, required)
  targetLang: Language (enum, required)
  translation: String (required)
  provider: String (required, default: "openai")
  expiresAt: Date (required, default: now + 30 days)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Indexes

- `{ text: 1, sourceLang: 1, targetLang: 1 }` - Compound unique index for cache lookup
- `{ expiresAt: 1 }` - TTL index (auto-delete expired entries)

### TTL Index

MongoDB automatically removes documents when `expiresAt` is reached (time-to-live index).

### Validations

- Compound unique constraint on (text, sourceLang, targetLang)
- All fields required except createdAt/updatedAt

### Usage Example

```typescript
import { TranslationCache } from "@/lib/models";
import { Language } from "@/types/models";

// Create or update cache
const cache = await TranslationCache.findOneAndUpdate(
  {
    text: "Hello world",
    sourceLang: Language.ENGLISH,
    targetLang: Language.SPANISH,
  },
  {
    translation: "Hola mundo",
    provider: "openai",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  { upsert: true, new: true }
);
```

## ExerciseAttempt Model

**Location:** `lib/models/ExerciseAttempt.ts`

### Schema

```typescript
{
  userId: String (required, ref: User)
  paragraphId: String (required, ref: Paragraph)
  exerciseType: ExerciseType (enum, required)
  userAnswer: String (required)
  correctAnswer: String (optional)
  score: Number (required, 0-100)
  feedback: String (optional)
  aiAnalysis: {
    strengths: [String] (default: [])
    improvements: [String] (default: [])
    suggestions: [String] (default: [])
  }
  timeSpentSeconds: Number (optional, min: 0)
  completedAt: Date (required, default: now)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Enums

**ExerciseType:**
- `translation` - Translate text between languages
- `gap_fill` - Fill in missing words
- `rewrite` - Rewrite text to improve it
- `comprehension` - Answer comprehension questions

### Indexes

- `{ userId: 1, completedAt: -1 }` - User's recent attempts
- `{ paragraphId: 1 }` - Attempts for a paragraph
- `{ exerciseType: 1 }` - Attempts by type
- `{ score: 1 }` - Query by score
- `{ userId: 1, exerciseType: 1, completedAt: -1 }` - User stats by type
- `{ createdAt: -1 }` - Recently created

### Validations

- Score: 0-100 range
- TimeSpentSeconds: non-negative
- All enum fields validated

### Usage Example

```typescript
import { ExerciseAttempt } from "@/lib/models";
import { ExerciseType } from "@/types/models";

const attempt = await ExerciseAttempt.create({
  userId: user._id,
  paragraphId: paragraph._id,
  exerciseType: ExerciseType.TRANSLATION,
  userAnswer: "My translation...",
  correctAnswer: "Correct translation...",
  score: 85,
  aiAnalysis: {
    strengths: ["Good grammar", "Clear meaning"],
    improvements: ["Vocabulary could be richer"],
    suggestions: ["Try using more varied vocabulary"],
  },
  timeSpentSeconds: 120,
});
```

## AdminUser Model

**Location:** `lib/models/AdminUser.ts`

### Schema

```typescript
{
  userId: String (required, unique, ref: User)
  role: AdminRole (enum, required, default: "moderator")
  permissions: [String] (array, max 50, default: [])
  notes: String (optional, max 1000 chars)
  createdBy: String (optional, ref: User)
  isActive: Boolean (required, default: true)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Enums

**AdminRole:**
- `super_admin` - Full access to all features
- `admin` - Most administrative features
- `moderator` - Content moderation only

### Indexes

- `{ role: 1, isActive: 1 }` - Query active admins by role
- `{ createdAt: -1 }` - Recently added admins
- `{ userId: 1 }` - Unique constraint (automatic)

### Validations

- UserId: unique
- Permissions: max 50 items
- Notes: max 1000 characters

### Usage Example

```typescript
import { AdminUser } from "@/lib/models";
import { AdminRole } from "@/types/models";

const admin = await AdminUser.create({
  userId: user._id,
  role: AdminRole.ADMIN,
  permissions: ["manage_users", "manage_content", "view_analytics"],
  notes: "Promoted from moderator",
  createdBy: superAdmin._id,
});
```

## Helper Functions

**Location:** `lib/db/helpers.ts`

### User Helpers

```typescript
// Get user by ID
await getUserById(userId: string): Promise<IUser | null>

// Get user by email
await getUserByEmail(email: string): Promise<IUser | null>

// Get user by Google ID
await getUserByGoogleId(googleId: string): Promise<IUser | null>

// Update subscription
await updateUserSubscription(userId: string, data: {...}): Promise<IUser | null>

// Update onboarding
await updateUserOnboarding(userId: string, data: {...}): Promise<IUser | null>
```

### Paragraph Helpers

```typescript
// Get active paragraphs with filters
await getActiveParagraphs(filters?: {
  difficulty?: DifficultyLevel;
  language?: Language;
  topics?: string[];
  limit?: number;
  skip?: number;
}): Promise<IParagraph[]>

// Get paragraph by ID
await getParagraphById(paragraphId: string): Promise<IParagraph | null>

// Create paragraph
await createParagraph(data: Partial<IParagraph>): Promise<IParagraph>

// Update paragraph
await updateParagraph(paragraphId: string, data: Partial<IParagraph>): Promise<IParagraph | null>

// Deactivate paragraph
await deactivateParagraph(paragraphId: string): Promise<IParagraph | null>
```

### Translation Cache Helpers

```typescript
// Get cached translation
await getCachedTranslation(
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<ITranslationCache | null>

// Set cached translation
await setCachedTranslation(
  text: string,
  sourceLang: Language,
  targetLang: Language,
  translation: string,
  provider?: string
): Promise<ITranslationCache>
```

### Exercise Attempt Helpers

```typescript
// Create exercise attempt
await createExerciseAttempt(data: Partial<IExerciseAttempt>): Promise<IExerciseAttempt>

// Get user exercise attempts
await getUserExerciseAttempts(userId: string, filters?: {...}): Promise<IExerciseAttempt[]>

// Get user exercise statistics
await getUserExerciseStats(userId: string): Promise<{
  totalAttempts: number;
  averageScore: number;
  attemptsByType: Record<string, number>;
}>
```

### Admin Helpers

```typescript
// Check if user is admin
await isUserAdmin(userId: string): Promise<boolean>

// Get admin user
await getAdminUser(userId: string): Promise<IAdminUser | null>

// Create admin user
await createAdminUser(data: Partial<IAdminUser>): Promise<IAdminUser>

// Update admin user
await updateAdminUser(userId: string, data: Partial<IAdminUser>): Promise<IAdminUser | null>

// Deactivate admin user
await deactivateAdminUser(userId: string): Promise<IAdminUser | null>

// Get all admins
await getAllAdmins(filters?: {...}): Promise<IAdminUser[]>
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Coverage

The test suite (`__tests__/models.test.ts`) covers:

- ✅ Model creation and validation
- ✅ Required field enforcement
- ✅ Unique constraint enforcement
- ✅ Enum validation
- ✅ Field length limits
- ✅ Array size limits
- ✅ Default values
- ✅ Sparse indexes
- ✅ Compound indexes
- ✅ Pre-save hooks
- ✅ Custom validations

### In-Memory MongoDB

Tests use `mongodb-memory-server` for fast, isolated testing without requiring a real MongoDB instance.

## Best Practices

### 1. Always Connect Before Operations

```typescript
import connectDB from "@/lib/db/mongoose";

await connectDB();
// Now perform database operations
```

### 2. Use Helper Functions

Prefer helper functions over direct model access:

```typescript
// Good
import { getUserById } from "@/lib/db/helpers";
const user = await getUserById(userId);

// Less optimal (but still valid)
import { User } from "@/lib/models";
await connectDB();
const user = await User.findById(userId);
```

### 3. Use TypeScript Types

Import and use TypeScript interfaces for type safety:

```typescript
import { IUser, Language, SubscriptionTier } from "@/types/models";

const userData: Partial<IUser> = {
  email: "user@example.com",
  learningLanguage: Language.ENGLISH,
};
```

### 4. Handle Errors

Always handle database errors gracefully:

```typescript
try {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
} catch (error) {
  console.error("Database error:", error);
  // Handle error appropriately
}
```

### 5. Use Lean Queries for Read-Only

Use `.lean()` for better performance when you don't need Mongoose document methods:

```typescript
// Returns plain JavaScript object
const user = await User.findById(userId).lean();
```

### 6. Pagination

Always paginate large result sets:

```typescript
const paragraphs = await getActiveParagraphs({
  difficulty: DifficultyLevel.BEGINNER,
  limit: 20,
  skip: page * 20,
});
```

### 7. Indexes

- Ensure indexes are created in production
- Monitor index usage with MongoDB's `explain()` command
- Remove unused indexes to improve write performance

### 8. Soft Deletes

Use `isActive` flag instead of deleting records:

```typescript
// Soft delete
await Paragraph.findByIdAndUpdate(id, { isActive: false });

// Query only active records
const activeParagraphs = await Paragraph.find({ isActive: true });
```

## Migration Guide

When adding new fields or changing schemas:

1. Update TypeScript interfaces in `types/models.ts`
2. Update Mongoose schema in `lib/models/*.ts`
3. Add tests in `__tests__/models.test.ts`
4. Update this documentation
5. Create migration script if needed
6. Run tests: `npm test`

## Environment Variables

```env
# Required
DATABASE_URL=mongodb://localhost:27017/easyenglish

# For MongoDB Atlas
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/easyenglish?retryWrites=true&w=majority
```

## Troubleshooting

### Connection Issues

- Verify `DATABASE_URL` is set correctly
- Check network connectivity to MongoDB
- Ensure IP whitelist includes your IP (for Atlas)
- Check MongoDB server is running (for local)

### Duplicate Key Errors

- Usually indicates unique constraint violation
- Check for existing records with same unique field
- Use `findOneAndUpdate` with `upsert: true` for idempotency

### Validation Errors

- Check required fields are provided
- Verify enum values are correct
- Check field length limits
- Use TypeScript types to catch errors early

## Further Reading

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
