# Language Onboarding Flow

## Overview

The language onboarding feature provides a user-friendly interface for new users to select their native language during the initial setup process. This information is used to personalize the learning experience throughout the application.

## Features

### User Interface
- **Welcome Screen**: Personalized greeting using the user's first name from their session
- **Search Functionality**: Real-time search across language codes, English names, and native names
- **Popular Languages**: Quick access to 12 most commonly used languages
- **Expandable Language Grid**: Access to 100+ languages with show/hide toggle
- **Visual Selection**: Animated card selection with checkmark badge
- **Confirmation Screen**: Brief success message before redirecting to subscription
- **Responsive Design**: Optimized for mobile and desktop with adaptive grid layouts

### Accessibility
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: 
  - Proper ARIA labels on language selection buttons
  - `aria-pressed` state to indicate selected language
  - Semantic HTML structure
- **Motion Preferences**: Respects `prefers-reduced-motion` for animations

### Animations
- **Entrance Animations**: Staggered fade-in for content using Framer Motion
- **Selection Animation**: Scale and glow effect on card selection
- **Badge Animation**: Spring animation for checkmark appearance
- **Hover Effects**: Smooth scale transitions on card hover

## Implementation

### File Structure

```
apps/web/
├── app/
│   ├── api/
│   │   └── user/
│   │       └── language/
│   │           └── route.ts          # API endpoint for language updates
│   └── onboarding/
│       ├── page.tsx                   # Redirects to /language
│       └── language/
│           └── page.tsx               # Main language selection interface
├── data/
│   └── languages.ts                   # Language dataset (100+ languages)
├── lib/
│   ├── auth/
│   │   └── config.ts                  # Updated to include language in session
│   └── models/
│       └── User.ts                    # Updated schema with language fields
├── types/
│   ├── models.ts                      # Updated IUser interface
│   └── next-auth.d.ts                 # Updated session types
└── __tests__/
    ├── languages.test.ts              # Tests for language data module
    └── language-api.test.ts           # Tests for API route
```

### Database Schema

The User model has been updated with the following fields:

```typescript
{
  nativeLanguage?: string;        // ISO 639-1 language code (e.g., "es", "fr")
  nativeLanguageName?: string;    // English name of the language (e.g., "Spanish")
  onboardingCompleted: boolean;   // Marks completion of onboarding process
}
```

### API Route

**Endpoint**: `PATCH /api/user/language`

**Authentication**: Required (uses NextAuth session)

**Request Body**:
```json
{
  "nativeLanguage": "es",
  "nativeLanguageName": "Spanish"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "user": {
    "nativeLanguage": "es",
    "nativeLanguageName": "Spanish",
    "onboardingCompleted": true
  }
}
```

**Error Responses**:
- `401`: Unauthorized (no session)
- `400`: Missing or invalid language code
- `404`: User not found
- `500`: Internal server error

### Session Data

The NextAuth session now includes language information:

```typescript
session.user.nativeLanguage      // ISO language code
session.user.nativeLanguageName  // English language name
session.user.onboardingCompleted // Boolean flag
```

## User Flow

1. **New User Signs In**: User authenticates via Google OAuth
2. **Middleware Check**: Middleware detects `onboardingCompleted: false` and redirects to `/onboarding`
3. **Automatic Redirect**: `/onboarding` immediately redirects to `/onboarding/language`
4. **Language Selection**:
   - User sees welcome message with their name
   - Can search through 100+ languages
   - Popular languages displayed prominently
   - Can expand to see all languages
5. **Selection Confirmation**:
   - Selected language appears in highlighted card at bottom
   - Continue button becomes enabled
6. **API Update**: User clicks Continue, triggering:
   - `PATCH /api/user/language` request
   - Database update with language and onboarding status
   - Session refresh with new data
7. **Confirmation Screen**: Brief success message with loading indicator
8. **Redirect to Subscribe**: After 1.5 seconds, user redirected to `/subscribe`

## Handling Edge Cases

### Already Completed Onboarding
If a user with `onboardingCompleted: true` visits the onboarding page:
- If `subscriptionStatus === "active"`: Redirect to `/dashboard`
- Otherwise: Redirect to `/subscribe`

### Language Pre-Selection
If a user has `nativeLanguage` set but `onboardingCompleted: false`:
- The page pre-selects their previously chosen language
- User can change selection and save again

### Session Refresh
After updating language:
- `update()` from `useSession()` refreshes the session
- Middleware will see `onboardingCompleted: true` on next navigation
- User will no longer be redirected to onboarding

## Language Dataset

The `data/languages.ts` file contains:
- **120+ languages** with complete metadata
- **12 popular languages** marked with `isPopular: true`
- Each language includes:
  - `code`: ISO 639-1/639-2 language code
  - `englishName`: Name in English
  - `nativeName`: Name in native script
  - `flag`: Flag emoji representation

### Helper Functions

```typescript
getLanguageByCode(code: string): LanguageData | undefined
// Returns language object for a given ISO code

searchLanguages(query: string): LanguageData[]
// Searches across all language fields, case-insensitive

POPULAR_LANGUAGES: LanguageData[]
// Array of popular languages only

OTHER_LANGUAGES: LanguageData[]
// Array of non-popular languages
```

## Testing

### Unit Tests

**Languages Data Module** (`languages.test.ts`):
- Validates dataset structure and completeness
- Tests search functionality
- Verifies language lookup functions
- **22 tests, all passing**

**API Route** (`language-api.test.ts`):
- Authentication requirements
- Input validation
- Language code validation
- Database updates
- Error handling
- **8 tests, all passing**

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- languages.test.ts
npm test -- language-api.test.ts

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Design Decisions

### Why String Instead of Enum for nativeLanguage?
- The enum `Language` only had 10 values
- We support 120+ languages for native language selection
- Using string allows flexibility for any language code
- Validation done at API level using language dataset

### Why Two Fields (nativeLanguage + nativeLanguageName)?
- `nativeLanguage`: Machine-readable code for programmatic use
- `nativeLanguageName`: Human-readable name for display purposes
- Allows showing "Spanish" to users while storing "es" in queries

### Why Redirect Through /onboarding?
- Maintains backward compatibility with existing middleware
- Single entry point for onboarding flow
- Easy to extend with additional onboarding steps in future

### Why 1.5 Second Delay on Confirmation?
- Gives user visual feedback that action succeeded
- Smooth transition without jarring immediate redirect
- Time to read success message

## Future Enhancements

Potential improvements for future iterations:

1. **Multi-Step Onboarding**: Add additional steps (proficiency level, learning goals)
2. **Language Suggestions**: Detect user's browser language and pre-suggest
3. **Recently Used Languages**: Show recently selected languages at top
4. **Language Categories**: Group languages by region or language family
5. **Custom Language Input**: Allow users to type in unsupported languages
6. **A/B Testing**: Test different layouts and flows for optimization
7. **Analytics**: Track which languages are most popular among users
8. **Skip Option**: Allow users to skip and complete later (requires product decision)

## Maintenance

### Adding New Languages

To add a new language to the dataset:

1. Open `data/languages.ts`
2. Add new entry to `LANGUAGES` array:
```typescript
{ 
  code: "xx", 
  englishName: "Language Name", 
  nativeName: "Native Name", 
  flag: "🏴",
  isPopular?: true  // Only for popular languages
}
```
3. Maintain alphabetical order by English name (except popular languages at top)
4. Ensure code is valid ISO 639-1 or 639-2 code
5. Run tests to verify: `npm test -- languages.test.ts`

### Updating Popular Languages

To change which languages are marked as popular:

1. Add or remove `isPopular: true` flag from language entries
2. Popular languages should be placed at top of array
3. Maintain 10-15 popular languages for optimal UX
4. Consider user analytics when selecting popular languages

## Related Documentation

- [Authentication System](./AUTHENTICATION.md)
- [MongoDB Models](./MONGODB_MODELS.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Main README](./README.md)
