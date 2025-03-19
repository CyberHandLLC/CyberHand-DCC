# CyberHand Authentication Schema Setup

## Introduction

This document outlines the database schema design focusing on authentication and user management for the CyberHand application. It describes the essential models required for the initial login and authentication system while ensuring the schema is prepared for future feature implementation.

## Core Authentication Models

The following models are essential for implementing the authentication system:

### User Model

The User model is the central entity for authentication and serves as the foundation for role-based access control.

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique @index // Added index for performance
  passwordHash  String
  firstName     String?
  lastName      String?
  phoneNumber   String?
  role          UserRole    @default(CLIENT)
  status        UserStatus  @default(ACTIVE)
  emailVerified Boolean     @default(false)
  
  // Client relationship - links user to client account
  // IMPORTANT: Schema limitation - application logic must enforce:
  // - clientId must be null for ADMIN/STAFF/OBSERVER roles
  // - clientId must be non-null for CLIENT role
  // Consider using database triggers or middleware validation to enforce this
  // IMPLEMENTATION RECOMMENDATION: Create a pre-save middleware that validates:
  //   if (user.role === 'CLIENT' && !user.clientId) throw new Error('CLIENT must have clientId');
  //   if (user.role !== 'CLIENT' && user.clientId) throw new Error('Non-CLIENT cannot have clientId');
  clientId      String?     
  client        Client?     @relation(fields: [clientId], references: [id], onDelete: SetNull)
  
  // Staff relationship - for staff/admin users
  staffProfile  Staff?      
  
  // Timestamps
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Current relationships
  sessions      Session[]
  auditLogs     AuditLog[]
  
  // FUTURE RELATIONSHIPS (with specific phase assignments):
  // Phase 2 (User Management & Notifications):
  // notifications   Notification[]   // User alerts and system messages
  // passwordResets  PasswordReset[]  // Secure password recovery
  
  // Phase 3 (Security Enhancements):
  // twoFactorAuth   TwoFactorAuth?   // Enhanced account security
  // loginAttempts   LoginAttempt[]   // Track failed login attempts
  
  // Phase 4 (Advanced Features):
  // userPreferences UserPreference?  // User customization settings

  @@index([role]) // Added index for role-based queries
}
```

### Session Model

Sessions track user login state and manage token-based authentication.

```prisma
model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade) // Delete sessions when user is deleted
  // SECURITY NOTE: Tokens should be generated with high entropy (at least 256 bits)
  // Use a secure JWT implementation with appropriate algorithm (e.g., RS256)
  // Consider implementing token rotation and absolute expiration times
  token     String   @unique @index // Added index for token lookups
  
  // NEW: Additional fields for HttpOnly cookie implementation (Phase 2)
  // These will be NULL if not using cookie-based authentication
  cookieToken String? @unique  // Session identifier for cookie (different from JWT)
  cookieName  String? // Name of the cookie to be set
  
  expiresAt DateTime
  // NEW: Extended session management fields
  absoluteExpiryDate DateTime? // Force logout after this date regardless of activity
  lastRefreshedAt DateTime? // Track when token was last refreshed
  
  // Security audit fields - ALWAYS POPULATED for proper security tracking
  // Using sentinel values instead of empty strings to distinguish missing data
  ipAddress String   @default("UNKNOWN") // App logic should enforce valid IP
  userAgent String   @default("UNKNOWN") // App logic should enforce valid user agent
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId]) // Added index for user session lookups
  @@index([ipAddress]) // Added index for security monitoring
  @@index([expiresAt]) // Added index for token cleanup tasks
}
```

### Enumerations

```prisma
enum UserRole {
  ADMIN     // System administrators with full access
  STAFF     // Internal staff with elevated privileges
  CLIENT    // Client users with access to their organization's data
  OBSERVER  // Read-only users that can view but not modify data
}

enum UserStatus {
  ACTIVE    // User can log in and access the system
  INACTIVE  // User account exists but cannot log in 
  SUSPENDED // User account temporarily restricted
}

// Using enums from the start for better type safety
enum AuditAction {
  LOGIN           // User logged in
  LOGOUT          // User logged out
  REGISTER        // New user registered
  PASSWORD_RESET  // Password reset requested/completed
  PASSWORD_CHANGE // Password changed
  PROFILE_UPDATE  // User profile updated
  CREATE          // Resource created
  READ            // Resource viewed/accessed
  UPDATE          // Resource updated
  DELETE          // Resource deleted
  EXPORT          // Data exported
  IMPORT          // Data imported
}

enum ResourceType {
  USER          // User record
  CLIENT        // Client organization
  STAFF         // Staff profile
  SERVICE       // Service offering
  SERVICE_TIER  // Service tier
  INVOICE       // Client invoice
  SESSION       // User session
  SUBSCRIPTION  // Service subscription
  CONTACT       // Client contact
}
```

### AuditLog Model

Essential for security tracking and compliance.

```prisma
model AuditLog {
  id          String       @id @default(uuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Using enums directly in Phase 1 for better type safety
  action      AuditAction
  resource    ResourceType
  // Recommended structure for details JSON:
  // {
  //   "ipAddress": string,  // SHOULD ALWAYS BE INCLUDED
  //   "userAgent": string,  // SHOULD ALWAYS BE INCLUDED
  //   "entityId": string,   // ID of the affected entity
  //   "oldValues": object (for updates),
  //   "newValues": object (for updates/creates),
  //   "metadata": {         // Additional context-specific data
  //     "key1": value1,
  //     "key2": value2
  //   }
  // }
  // IMPORTANT: Be consistent with the structure to enable reliable querying
  // via Prisma's JSON filtering (e.g., where: { details: { path: ['ipAddress'], equals: '127.0.0.1' }})
  details     Json?    // Additional details about the action
  timestamp   DateTime @default(now())

  @@index([userId, action]) // Added index for querying user actions
  @@index([timestamp]) // Added index for time-based queries
  @@index([action, resource]) // Added index for filtering by action and resource
}
```

## Client Model (Required for User-Client Relationship)

The Client model is essential even for authentication because it establishes the relationship between users and organizations.

```prisma
model Client {
  id               String            @id @default(uuid())
  companyName      String
  industry         String?
  websiteUrl       String?
  serviceStartDate DateTime?
  serviceEndDate   DateTime?
  notes            String?
  
  // Timestamps
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  
  // Current relationships
  users            User[]            // Multiple users can be associated with a client
  
  // FUTURE RELATIONSHIPS (with specific phase assignments):
  // Phase 2 (Client Management):
  // contacts         ClientContact[]   // Client contacts/representatives
  // staffAssignments ClientStaffAssignment[] // Staff assigned to clients
  
  // Phase 3 (Service Management):
  // clientServices   ClientService[]   // Services the client has purchased
  // packages         ClientPackage[]   // Service packages purchased
  
  // Phase 4 (Billing & Invoicing):
  // invoices         Invoice[]         // Client billing records
  // subscriptions    Subscription[]    // Recurring payment subscriptions

  @@index([companyName]) // Added index for company name searches
}
```

### Staff Model (For Admin/Staff Users)

```prisma
model Staff {
  id          String    @id @default(uuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String?
  department  String?
  hireDate    DateTime?
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt  // Fixed: removed incorrect default value
  
  // Future relationships
  // Phase 2 (Client Management):
  // assignedClients ClientStaffAssignment[] // Staff assigned to clients
  
  // Phase 3 (Team Management):
  // teamMemberships TeamMember[]     // Staff participation in teams
  // managedTeams    Team[]           // Teams this staff member manages

  @@index([userId]) // Added index for user lookups
}
```

## Implementation Guidelines

### User Registration and Login Flow

1. **Registration Process**:
   - Validate email uniqueness
   - Hash password using bcrypt (with appropriate salt rounds, min. 10)
   - Create User record with appropriate role
   - If role is CLIENT, create Client record and link via clientId
   - If role is ADMIN/STAFF, create associated Staff record
   - Generate email verification token (optional for initial implementation)
   - Create audit log entry for the registration
   - Implement rate limiting for registration attempts from the same IP

2. **Login Process**:
   - Validate credentials (email + password)
   - Check user status (must be ACTIVE)
   - Verify email is verified (if email verification is enabled)
   - Check for suspicious activity (failed login attempts, unusual location)
   - Generate JWT token with appropriate expiration (max 24 hours recommended)
   - Create Session record with token, IP address, and user agent
     - ALWAYS populate ipAddress and userAgent for security tracking
     - IP address should be stored in a consistent format (IPv4 or IPv6)
   - Record login in AuditLog with device and location information
   - Return token and user information (excluding passwordHash)
   - Implement rate limiting for failed login attempts
     - IMPLEMENTATION DETAILS:
     - Store failed attempts with timestamps per username and IP address
     - Suggested thresholds: 5 failures per account and 10 per IP in 15 minutes
     - Use Redis or similar for high-performance tracking
     - Exponentially increase delay after failures (e.g., 1s, 2s, 4s, 8s...)
     - Consider account lockouts after threshold exceeded (require email verification)

3. **Session Management**:
   - Validate token on protected routes
   - Check token expiration
   - Verify session still exists in database (for revocation support)
   - Implement token refresh mechanism
   - Provide logout functionality that invalidates sessions
   - Support multi-device sessions with option to revoke individual sessions
   - Consider implementing absolute session timeouts (e.g., 2 weeks)
   
   // NEW: Cookie-based session management
   - Phase 2 will introduce HttpOnly cookie support:
     - Set cookies with proper HttpOnly, Secure, and SameSite flags
     - Store separate cookie identifier in the Session model
     - Implement CSRF protection for cookie-based authentication
     - Support both header-based and cookie-based authentication methods
     - Align with frontend implementation timeline (Weeks 3-4)

4. **Role-Based Access Control**:
   - Use middleware to check user role for protected routes
   - Implement different permission levels based on user role
   - Validate clientId access for CLIENT role users

## Important Schema Considerations

### Type Safety and Enforcement

1. **Role Handling**:
   - The `UserRole` enum enforces valid role values
   - Application logic must enforce that CLIENT role users have a valid clientId
   - Only ADMIN and STAFF roles should have associated Staff records
   - Consider implementing database triggers or middleware validators to ensure data integrity

2. **Relationship Enforcement**:
   - `clientId` is null for ADMIN/STAFF/OBSERVER roles and required for CLIENT role (enforced in application logic)
   - Staff profile is created only for ADMIN/STAFF users
   - Implement validation middleware that checks these constraints before database operations

### Database Optimizations

1. **Indexes Added**:
   - `User.email` - Optimizes login queries
   - `User.role` - Improves role-based filtering
   - `Session.token` - Speeds up token validation
   - `Session.userId` - Improves session lookup by user
   - `AuditLog` - Indexes for common security queries

2. **Cascade Deletes**:
   - Sessions are deleted when a User is deleted (onDelete: Cascade)
   - AuditLogs are deleted when a User is deleted (onDelete: Cascade)
   - Staff profile is deleted when a User is deleted (onDelete: Cascade)
   - User records are preserved when a Client is deleted, but clientId is set to null (onDelete: SetNull)

## Future Schema Extensions

The authentication schema is designed to support future features:

1. **Client Management** (Phase 2):
   - Client contacts management
   - Staff assignment to clients
   - Team structure for staff
   - The Client model will link to services through ClientService model
   - User authentication will enforce client-service access permissions

2. **Service Management** :
   - Service definitions and tiers
   - Client service purchases and history
   - Service packages and bundling

3. **Billing and Subscriptions** :
   - Invoice generation and tracking
   - Subscription management
   - Payment processing integration
   - Authentication will integrate with subscription status checks
   - Role permissions will be tied to subscription levels
   - Client service access will be tied to subscription status

4. **Notifications** :
   - A Notification model will be implemented to handle user alerts
   - Initial structure will include:
     ```prisma
     model Notification {
       id          String    @id @default(uuid())
       userId      String
       user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
       title       String
       message     String
       isRead      Boolean   @default(false)
       type        String    // INFO, WARNING, ERROR, SUCCESS
       link        String?
       createdAt   DateTime  @default(now())
       updatedAt   DateTime  @updatedAt
     }
     ```
   - This model will be linked to the User model via the currently commented-out relationship
   - Authentication events will trigger notifications

5. **Security Enhancements** :
   - Two-factor authentication
   - Password reset functionality
   - Login attempt tracking
   - Session management improvements

6. **User Preferences** (Phase 4):
   - Customizable user settings
   - Dashboard configurations
   - Notification preferences

## Implementation Order

For the initial authentication implementation (Phase 1), focus on these components in order:

1. Database schema setup (User, Session, Client, Staff models)
2. Password hashing and verification utilities
3. User registration endpoint with role-based handling
4. User login endpoint and JWT generation
5. Session management with proper security tracking
6. Authentication middleware for protected routes
7. Basic role-based access control
8. Audit logging for security events

// NEW: Enhanced Security Implementation Plan
## Authentication Security Implementation Timeline

### Phase 1: Core Authentication (Weeks 1-2)
- Complete basic schema implementation
- JWT header-based authentication
- Role-based access control with clientId validation
- Standard token refresh mechanism
- Proper security logging

### Phase 2: Enhanced Authentication Security (Weeks 3-4)
- HttpOnly cookie implementation (coordinated with frontend)
  - Update Session model with cookie-specific fields
  - Implement cookie middleware on backend endpoints
  - Set proper security flags (HttpOnly, Secure, SameSite)
- CSRF protection for cookie-based authentication
- Configurable token expiration and refresh settings:
  ```
  // Environment variables to add in .env
  TOKEN_EXPIRY_HOURS=24
  REFRESH_WINDOW_HOURS=4
  MAX_SESSION_DAYS=14
  ```
- Improved logging and monitoring

After authentication is complete, the development will proceed to:

**Phase 2: Client Management & Notifications**
1. Client contacts management
2. Staff assignments to clients
3. Notification system
4. Password reset functionality

**Phase 3: Service Management & Security Enhancements**
1. Service definitions and tiers
2. Client service purchases

**Phase 4: Billing & User Customization**
1. Invoice generation
2. Subscription management
3. User preferences

This logical flow ensures that core functionality is built first, followed by progressively more complex features that build upon the foundation.

## Conclusion

This schema provides the essential structure for implementing authentication while ensuring the database design supports the full range of planned features. By implementing the core models with careful attention to relationships, indexes, and cascade behaviors, the system will maintain data integrity and performance as it scales.
