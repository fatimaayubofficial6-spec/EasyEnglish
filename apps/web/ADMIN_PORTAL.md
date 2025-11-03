# Admin Portal Documentation

The Admin Portal provides a secure interface for administrators to manage the EasyEnglish platform, including content management, user oversight, and metrics tracking.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Security](#security)
- [Testing](#testing)

## Features

### 1. Admin Authentication
- **Credentials-based login**: Email and password authentication separate from user NextAuth
- **JWT sessions**: Secure session management with httpOnly cookies
- **Role-based access**: Support for multiple admin roles (SUPER_ADMIN, ADMIN, MODERATOR)

### 2. Dashboard
View key platform metrics:
- Active subscribers count
- Monthly Recurring Revenue (MRR)
- Daily exercise completions
- Total paragraph count
- Weekly activity trends

### 3. Paragraph Management
- **List view**: Paginated table with search and filter capabilities
- **Create**: Add new exercise paragraphs with validation
- **Edit**: Update existing paragraphs
- **Delete**: Remove paragraphs (hard delete)
- **Toggle Active**: Enable/disable paragraphs without deletion
- **Filters**: Search by title/content, filter by difficulty

### 4. Subscriber Management
- **List view**: Paginated table of all users
- **Search**: Find users by email or name
- **Filter**: Filter by subscription status
- **Activity tracking**: View last exercise date and join date

## Setup

### 1. Environment Variables

Add the following to your `.env.local`:

```bash
# Admin Portal Configuration
ADMIN_JWT_SECRET=your-admin-jwt-secret-here-change-in-production
# Generate with: openssl rand -base64 32

# Admin user credentials (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Admin User
```

### 2. Create Initial Admin User

Run the setup script to create your first admin user:

```bash
npm run admin:create
```

This will create an admin user with the credentials specified in your environment variables.

**Important**: Change the password after first login.

### 3. Create Admin Manually (Alternative)

If you prefer to create an admin user programmatically or need to hash a password:

```typescript
import { hashPassword } from "@/lib/auth/admin";
import AdminUser from "@/lib/models/AdminUser";
import { AdminRole } from "@/types/models";

const hashedPassword = await hashPassword("your-password");

await AdminUser.create({
  email: "admin@yourdomain.com",
  hashedPassword,
  name: "Admin Name",
  role: AdminRole.SUPER_ADMIN,
  isActive: true,
});
```

## Usage

### Accessing the Admin Portal

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to `/admin/dashboard`

### Managing Paragraphs

1. From the dashboard, click "Go to Paragraphs" or navigate to `/admin/paragraphs`
2. **Add Paragraph**: Click "Add Paragraph" button
   - Fill in title, content, difficulty, and topics
   - Topics should be comma-separated
   - Content must be at least 50 characters
3. **Edit Paragraph**: Click the edit icon on any paragraph
4. **Delete Paragraph**: Click the trash icon (requires confirmation)
5. **Toggle Active**: Click the power icon to activate/deactivate

### Viewing Subscribers

1. From the dashboard, click "View Subscribers" or navigate to `/admin/subscribers`
2. Use the search bar to find specific users
3. Filter by subscription status using the dropdown
4. Navigate through pages to view all subscribers

## API Routes

### Authentication

#### POST `/api/admin/auth/login`
Login with admin credentials.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "super_admin"
  }
}
```

#### POST `/api/admin/auth/logout`
Clear admin session.

#### GET `/api/admin/auth/me`
Get current admin session info.

### Dashboard

#### GET `/api/admin/dashboard/stats`
Get dashboard metrics.

**Response:**
```json
{
  "stats": {
    "activeSubscribers": 150,
    "mrr": 1500,
    "dailyCompletions": 45,
    "paragraphCount": 89,
    "totalUsers": 200,
    "weeklyCompletions": 320
  }
}
```

### Paragraphs

#### GET `/api/admin/paragraphs`
List paragraphs with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in title/content
- `difficulty`: Filter by difficulty level
- `topic`: Filter by topic

#### POST `/api/admin/paragraphs`
Create a new paragraph.

**Request:**
```json
{
  "title": "Business Meeting Vocabulary",
  "content": "In today's fast-paced business environment...",
  "difficulty": "intermediate",
  "language": "en",
  "topics": ["business", "vocabulary"]
}
```

#### GET `/api/admin/paragraphs/[id]`
Get a specific paragraph.

#### PATCH `/api/admin/paragraphs/[id]`
Update a paragraph.

#### DELETE `/api/admin/paragraphs/[id]`
Delete a paragraph.

### Subscribers

#### GET `/api/admin/subscribers`
List subscribers with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search in email/name
- `status`: Filter by subscription status

## Security

### Authentication & Authorization

1. **Separate from User Auth**: Admin authentication is completely separate from the NextAuth system used for regular users.

2. **JWT Sessions**: Admin sessions use JWT tokens stored in httpOnly cookies, preventing XSS attacks.

3. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds.

4. **Middleware Protection**: All `/admin/*` routes are protected by middleware that validates the admin session.

5. **API Route Protection**: All admin API routes require authentication via `requireAdminAuth()`.

### Best Practices

1. **Strong Passwords**: Use strong, unique passwords for admin accounts
2. **Limited Access**: Only create admin accounts for trusted personnel
3. **Regular Audits**: Monitor admin activity through application logs
4. **Environment Secrets**: Never commit real credentials to version control
5. **Session Timeout**: Admin sessions expire after 24 hours

### Recommended Security Enhancements

For production deployments, consider:

1. **Two-Factor Authentication (2FA)**: Add TOTP-based 2FA for admin logins
2. **IP Whitelisting**: Restrict admin access to specific IP ranges
3. **Audit Logging**: Log all admin actions for compliance and security monitoring
4. **Rate Limiting**: Implement rate limiting on admin login attempts
5. **Session Management**: Add ability to revoke active sessions

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run admin-specific tests
npm test admin

# Run with coverage
npm test:coverage
```

### Test Coverage

The admin portal includes comprehensive test coverage:

1. **Authentication Tests** (`__tests__/admin-auth.test.ts`)
   - Password hashing and verification
   - JWT token creation and validation

2. **API Route Tests** (`__tests__/admin-api.test.ts`)
   - Login/logout flows
   - Paragraph CRUD operations
   - Subscriber listing and filtering
   - Input validation and error handling

### Manual Testing Checklist

- [ ] Admin can log in with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Admin can view dashboard metrics
- [ ] Admin can create a new paragraph
- [ ] Admin can edit an existing paragraph
- [ ] Admin can delete a paragraph
- [ ] Admin can toggle paragraph active status
- [ ] Admin can search and filter paragraphs
- [ ] Admin can view subscriber list
- [ ] Admin can search and filter subscribers
- [ ] Admin can logout successfully
- [ ] Unauthorized users cannot access admin routes
- [ ] Changes to paragraphs reflect immediately in user UI

## Database Schema

### AdminUser Collection

```typescript
{
  email: string;           // Unique admin email
  hashedPassword: string;  // Bcrypt hashed password
  name?: string;           // Display name
  role: AdminRole;         // super_admin | admin | moderator
  permissions: string[];   // Custom permissions array
  notes?: string;          // Internal notes
  createdBy?: string;      // ID of admin who created this user
  isActive: boolean;       // Account status
  createdAt: Date;
  updatedAt: Date;
}
```

## Troubleshooting

### Cannot Login

1. Check that admin user exists in database
2. Verify `ADMIN_JWT_SECRET` is set in environment
3. Check browser console for errors
4. Verify admin user `isActive` is `true`

### Session Expires Immediately

1. Verify `ADMIN_JWT_SECRET` is consistent
2. Check cookie settings in browser (allow httpOnly cookies)
3. Ensure server time is correct (JWT expiration relies on timestamps)

### Cannot Create Paragraphs

1. Verify MongoDB connection is active
2. Check content meets minimum length (50 characters)
3. Ensure difficulty is valid enum value
4. Check browser network tab for error details

### Dashboard Shows Zero for All Metrics

1. Verify MongoDB connection
2. Check that collections exist and have data
3. Review server logs for database query errors

## Future Enhancements

Potential improvements for the admin portal:

1. **Bulk Operations**: Bulk activate/deactivate/delete paragraphs
2. **Export Functionality**: Export subscriber lists and exercise data to CSV
3. **Analytics Dashboard**: Enhanced metrics with charts and trends
4. **Content Scheduling**: Schedule paragraphs to become active at specific times
5. **User Impersonation**: Safely view platform as a specific user (for support)
6. **Email Notifications**: Alert admins of important events
7. **Admin Activity Log**: Detailed audit trail of all admin actions
8. **Advanced Permissions**: Granular permissions system for different admin roles
9. **Content Moderation**: Review and approve user-generated content
10. **System Health Monitoring**: Database status, API health, error rates

## Support

For issues or questions about the admin portal:

1. Check this documentation
2. Review test files for usage examples
3. Check application logs for error details
4. Contact the development team
