# Frontend Authentication Implementation Guide

This document provides concise but comprehensive instructions for implementing frontend authentication that integrates with our backend schema.

## Core Components

### 1. Authentication Service
- **Purpose**: Central service for all auth-related API interactions
- **Implementation Requirements**:
  - JWT token management (storage, refresh, validation)
  - Login/logout functionality with proper error handling
  - User registration with field validation
  - Session persistence between page refreshes
  - Security headers and CSRF protection
  - **Token Refresh Schedule**: Implement refresh cycle aligned with backend expiration (24 hours)
  - **Client-Side Role Validation**: Verify user.clientId is non-null for CLIENT role and null for others
  - **Configurable Timeouts**: Implementation should support environment-specific configuration of all timeout values

### 2. Authentication Context
- **Purpose**: Global state provider for authentication status
- **Implementation Requirements**:
  - Store current user data and authentication status
  - Provide authentication methods to all components
  - Handle loading states during authentication operations
  - Initialize auth state from stored tokens on app load
  - Manage role-based access control logic
  - **Data Consistency Checks**: Validate role-clientId relationship on login and after token refresh
  - **Fallback Mechanism**: Implement forced logout if user data is inconsistent with role requirements
  - **Validation Caching**: Cache validation results to prevent redundant checks
  - **Cache Invalidation Triggers**:
    - User role changes
    - User clientId changes
    - Token refresh completion
    - Manual logout/login actions
    - Receiving 403 errors from previously allowed endpoints

### 3. Protected Routes
- **Purpose**: Restrict access to routes based on authentication and role
- **Implementation Requirements**:
  - Route wrapper component checking authentication status
  - Support for role-based restrictions (ADMIN, STAFF, CLIENT, OBSERVER)
  - Redirect to login for unauthenticated users
  - Show appropriate error for unauthorized access
  - Remember intended destination for post-login redirect
  - **Double Validation**: Verify both role and clientId consistency before rendering protected content
  - **Specific Error Routes**:
    - `/login` - For unauthenticated users
    - `/unauthorized` - For authenticated users with insufficient permissions (Example message: "You don't have permission to access this area. Contact your administrator if you believe this is an error.")
    - `/account-error` - For role-clientId inconsistencies (Example message: "We've detected an inconsistency with your account configuration. For security reasons, you've been signed out. Please sign in again.")
    - `/session-expired` - For expired sessions with custom messaging (Example message: "Your session has expired. Please sign in again to continue where you left off.")

### 4. API Configuration
- **Purpose**: Centralized API settings for authentication and all requests
- **Implementation Requirements**:
  - Environment-specific base URLs
  - Authentication header injection for protected endpoints
  - Response interceptors for handling expired tokens
  - Error standardization and handling
  - Request timeout management
  - **Token Timing Settings**:
    - Token refresh attempt at 20 hours (before 24-hour backend expiration)
    - Force re-authentication after 14 days of continuous use
    - Background refresh 30 minutes before expiration
    - **On-demand refresh** on route changes if token is within 1 hour of expiration
    - **Activity detection** to refresh token when user returns after inactivity
  - **Configurable Timeout Parameters**:
    ```typescript
    // Example configuration structure in .env files
    REACT_APP_TOKEN_EXPIRY_HOURS=24
    REACT_APP_TOKEN_REFRESH_BEFORE_HOURS=4
    REACT_APP_INACTIVITY_THRESHOLD_MINUTES=60
    REACT_APP_VALIDATION_THRESHOLD_MINUTES=30
    REACT_APP_MAX_SESSION_DAYS=14
    ```
  - **Environment Variable Fallbacks**:
    ```typescript
    // src/config/authConfig.ts
    export const AUTH_CONFIG = {
      // Token expiration settings (with fallbacks)
      tokenExpiryHours: 
        parseInt(process.env.REACT_APP_TOKEN_EXPIRY_HOURS || '24', 10),
      tokenRefreshBeforeHours: 
        parseInt(process.env.REACT_APP_TOKEN_REFRESH_BEFORE_HOURS || '4', 10),
      inactivityThresholdMinutes: 
        parseInt(process.env.REACT_APP_INACTIVITY_THRESHOLD_MINUTES || '60', 10),
      validationThresholdMinutes: 
        parseInt(process.env.REACT_APP_VALIDATION_THRESHOLD_MINUTES || '30', 10),
      maxSessionDays: 
        parseInt(process.env.REACT_APP_MAX_SESSION_DAYS || '14', 10),
      
      // Calculate derived values
      get tokenRefreshAtMs() {
        return (this.tokenExpiryHours - this.tokenRefreshBeforeHours) * 60 * 60 * 1000;
      },
      get absoluteExpiryMs() {
        return this.maxSessionDays * 24 * 60 * 60 * 1000;
      },
      get inactivityThresholdMs() {
        return this.inactivityThresholdMinutes * 60 * 1000;
      },
      get validationThresholdMs() {
        return this.validationThresholdMinutes * 60 * 1000;
      }
    };
    
    // Usage example:
    // import { AUTH_CONFIG } from 'src/config/authConfig';
    // if (timeSinceLastActivity > AUTH_CONFIG.inactivityThresholdMs) {
    //   refreshToken();
    // }
    ```

## Dashboard Implementation

### Consolidated Dashboard Layout
- Use a single dashboard component that adapts based on user role
- Dynamically generate navigation options based on user permissions
- Show role-appropriate content and functionality
- Maintain consistent UI structure across all user types
- Implement responsive design for all device sizes
- **Optimized Role Validation**: 
  - Validate on route entry only, not on each render
  - Cache validation results in context
  - Revalidate only on user data changes or navigation

### Role-Based Navigation and Content

| Role | Available Navigation | Content Displayed | Permissions |
|------|---------------------|-------------------|-------------|
| ADMIN | Users, Clients, Services, Staff, Settings | Full CRUD for all entities, system configuration, audit logs | Create/update/delete for all entities |
| STAFF | Clients, Services, Profile | Client management, service assignments, limited reporting, personal settings | Create/update for assigned clients and services, read-only for others |
| CLIENT | Services, Invoices, Profile | Purchased services only, billing history, personal settings | Read-only for services, update for personal profile |
| OBSERVER | Reports, Profile | Read-only analytics, system reports, personal settings | Read-only for all data |

### Content Access Controls
- **Services Section**:
  - ADMIN: Full service management, creation, pricing, assignment
  - STAFF: View assigned services, manage client service relationships
  - CLIENT: View purchased/available services, manage subscriptions
  - OBSERVER: View service catalog and usage analytics only

- **User Management**:
  - ADMIN: Manage all users, roles, permissions
  - STAFF: View assigned clients, limited profile editing
  - CLIENT/OBSERVER: Self-profile management only

- **Reporting**:
  - ADMIN: Full system analytics, financial reporting, audit logs
  - STAFF: Client performance metrics, service usage
  - CLIENT: Personal usage statistics only
  - OBSERVER: System-wide performance metrics (read-only)

## Implementation Process

### 1. API Model Integration
- Follow the established model pattern:
  - Create interface defining the contract (methods, types)
  - Implement real API client making HTTP requests
  - Use proper typing with ApiResponse<T> return types
  - Register models in the central registry

### 2. Authentication Flow
- Login process:
  - Collect and validate credentials
  - Send to authentication endpoint
  - Store JWT securely (see secure storage options below)
  - **Validate Role-ClientId Consistency**: Ensure CLIENT role has non-null clientId and others have null
  - Update global authentication state
  - Redirect to appropriate dashboard

- Registration process:
  - Collect and validate user information
  - Submit to registration endpoint
  - Auto-login on successful registration
  - Redirect to appropriate onboarding or dashboard

- Session management:
  - Check for existing token on application initialization
  - Implement token refresh mechanism with specific timing:
    - Refresh tokens after 20 hours (before 24-hour backend expiration)
    - Force re-authentication after 14 days of continuous use
    - Background refresh 30 minutes before expiration
    - **Check and refresh on user activity after dormant periods**
    - **Immediate token validation on route changes after inactivity**
  - Handle session timeouts gracefully
  - Provide clear feedback on authentication status

### 3. useRealApi Integration
- Use the useRealApi hook for all API interactions
- Implement proper API call pattern:
  - Memoize fetch functions with useCallback
  - Handle loading states consistently
  - Implement comprehensive error handling
  - Use proper type annotations
  - Cancel pending requests on component unmount

## Security Best Practices

### Token Storage Implementation Plan

#### Phase 1 (Initial Implementation - Week 1-2)
- Implement **Web Storage with Encryption** as the initial approach
- Use a robust client-side encryption library (e.g., CryptoJS)
- Set up all timeout and expiration handling
- Document the temporary nature of this solution

#### Phase 2 (HttpOnly Cookie Migration - Week 3-4)
- Coordinate with backend team to implement HttpOnly cookie support
- Modify backend authentication endpoints to set proper cookies
- Update frontend to work with HttpOnly cookies
- Implement proper CSRF protection
- Create fallback mechanisms for browsers without cookie support

#### If Backend Support Is Delayed
- Continue with the encrypted storage approach
- Enhance with additional security measures:
  - Implement stronger Content-Security-Policy headers
  - Add token fingerprinting
  - Consider subdomain isolation for authenticated sections
- Revisit HttpOnly cookie implementation when backend support is available

### Token Storage Options (in order of security preference)
1. **HttpOnly Cookies** (preferred when supported by backend):
   - Set by backend with HttpOnly and Secure flags
   - Include SameSite=Strict attribute
   - Immune to client-side XSS attacks
   - Requires CSRF protection mechanisms

2. **Web Storage with Encryption** (DEFAULT APPROACH if backend doesn't support HttpOnly cookies):
   - Encrypt token before storing in localStorage
   - Use application-specific encryption key
   - Decrypt only when needed for API calls
   - Clear memory after use
   - **Implementation Note**: Coordinate with backend team to ensure they understand client-side token handling when HttpOnly cookies aren't an option

3. **In-Memory Storage with Session Storage Backup**:
   - Primary storage in JavaScript memory variables
   - Backup in sessionStorage (cleared on tab close)
   - Refresh token only in sessionStorage for recovery
   - Active mitigation against XSS with Content-Security-Policy headers

4. **If using localStorage directly** (least secure, use only with all mitigations):
   - Implement strong Content-Security-Policy headers
   - Use subdomain isolation for authenticated sections
   - Regular security audits for XSS vulnerabilities
   - Consider token fingerprinting with device/browser information

### Token Handling
- Never store sensitive user information in client storage
- Clear tokens reliably on logout from all storage locations
- Implement proper token refresh mechanism aligned with backend expiration
- Handle token expiration gracefully
- Consider token rotation on sensitive operations

### Request Security
- Use HTTPS for all API communications
- Implement proper CSRF protection
- Add appropriate security headers:
  - Content-Security-Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Referrer-Policy: strict-origin-when-cross-origin
- Sanitize all user inputs
- Implement rate limiting for authentication attempts

## Comprehensive Error Handling

### Authentication-Specific Errors
- **401 Unauthorized**: 
  - Clear token storage
  - Redirect to `/session-expired`
  - Display appropriate message about session expiration
  - Preserve attempted URL for redirect after login
  - **Example Message**: "Your session has expired. Please sign in again to continue your work. We'll take you right back to where you were."

- **403 Forbidden**:
  - Redirect to `/unauthorized`
  - Display explanation based on error context (role insufficient vs. client access)
  - Log client-side error details for troubleshooting
  - **Example Message**: "You don't have permission to access this resource. If you believe this is an error, please contact your administrator or support team."

- **400 Bad Request (during auth)**:
  - Parse server validation errors
  - Display field-specific error messages
  - Maintain form state for user correction
  - **Example Message**: "We couldn't complete your request. Please check the highlighted fields and try again."

- **5xx Server Errors**:
  - Implement retry mechanism with exponential backoff
  - Show user-friendly error message
  - Provide alternative paths (support contact, retry button)
  - **Example Message**: "We're experiencing technical difficulties. Our team has been notified. Please try again in a few minutes or contact support if the problem persists."

### Client-Side Validation Errors
- **Role-ClientId Mismatch**:
  - Force logout with specific error message
  - Log inconsistency details to monitoring system
  - Redirect to `/account-error` with error explanation
  - **Example Message**: "We've detected an inconsistency with your account configuration. For security reasons, you've been signed out. Please sign in again or contact support if this continues."

- **Token Parsing Failures**:
  - Clear invalid token data
  - Force reauthorization
  - Log parsing error details
  - **Example Message**: "Your authentication information appears to be corrupted. Please sign in again to resolve this issue."

- **Missing Required Data**:
  - Validate complete user profile after authentication
  - Redirect to profile completion if required fields missing
  - **Example Message**: "Please complete your profile to continue. This information is required to provide you with the best experience."

### Error Logging Implementation

- **Client-Side Logging Service**:
  ```typescript
  // src/services/logService.ts
  export const logService = {
    error: (category: string, message: string, data?: any) => {
      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[${category}]`, message, data);
      }
      
      // Send to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        // Send to centralized logging service
        // Options include:
        // 1. Send to backend API endpoint
        // 2. Use third-party service like Sentry or LogRocket
        // 3. Store in localStorage for later transmission
      }
    },
    warn: (category: string, message: string, data?: any) => {
      // Similar implementation
    },
    info: (category: string, message: string, data?: any) => {
      // Similar implementation
    }
  };
  ```

- **Logging Categories**:
  - `auth.login` - Login attempts and failures
  - `auth.token` - Token refresh and validation issues
  - `auth.session` - Session management
  - `auth.permission` - Permission and access control issues
  - `auth.validation` - Data validation errors

- **Sensitive Data Handling**:
  - Never log tokens, passwords or personal information
  - Use data scrubbing before logging
  - Log user IDs but not identifiable information

## Performance Optimization for Validation

### Efficient Validation Strategy
1. **Full Validation Points**:
   - On initial login/registration
   - After token refresh
   - On route changes (through Protected Route component)
   - When user data is updated
   - **After system detects inactivity**

2. **Cached Validation**:
   - Store validation results in AuthContext
   - Reuse results for rendering decisions
   - **Invalidate cache when**:
     - User role changes
     - Client associations are modified
     - After successful token refresh
     - After receiving unexpected 403 errors
     - Manual logout/login actions
   - Use React.memo for components dependent on validation

3. **Progressive Enhancement**:
   - Render UI skeleton before validation completes
   - Use optimistic UI patterns where appropriate
   - Defer heavy validation to after initial render
   - Prioritize critical validations over convenience checks

4. **Inactivity Handling**:
   - Monitor user activity with idle detection
   - Refresh tokens proactively when user returns after inactivity
   - Provide smooth re-authentication experience when sessions expire
   - Show friendly notifications about session status

### Specific Inactivity Detection Implementation

```typescript
// src/hooks/useActivityMonitor.ts
export const useActivityMonitor = (onInactiveReturn: () => void) => {
  const { AUTH_CONFIG } = useAuthConfig();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isInactive, setIsInactive] = useState<boolean>(false);
  
  // Track user activity events
  useEffect(() => {
    const activityEvents = [
      'mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'
    ];
    
    const handleUserActivity = throttle(() => {
      const now = Date.now();
      const wasInactive = now - lastActivity > AUTH_CONFIG.inactivityThresholdMs;
      
      if (wasInactive && isInactive) {
        // User has returned after inactivity
        setIsInactive(false);
        onInactiveReturn();
      }
      
      setLastActivity(now);
    }, 1000); // Throttle to prevent excessive updates
    
    // Register all activity event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });
    
    // Check for inactivity periodically
    const inactivityCheck = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > AUTH_CONFIG.inactivityThresholdMs && !isInactive) {
        setIsInactive(true);
      }
    }, 60000); // Check every minute
    
    return () => {
      // Clean up event listeners and interval
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [lastActivity, isInactive, onInactiveReturn, AUTH_CONFIG]);
  
  return { lastActivity, isInactive };
};

// Usage in AuthContext:
const AuthProvider = ({ children }) => {
  // ... other auth state

  const handleUserReturnAfterInactivity = useCallback(() => {
    // Validate token and refresh if needed
    validateAuthState();
  }, [validateAuthState]);

  const { isInactive } = useActivityMonitor(handleUserReturnAfterInactivity);
  
  // Use isInactive state to conditionally render a "Session may be expired" message
  // ...
}
```

### Exact Validation Trigger Points

1. **Router Implementation**:
   ```typescript
   // src/components/ProtectedRoute.tsx
   const ProtectedRoute = ({ children, requiredRoles }) => {
     const { user, isAuthenticated, validateAuthState } = useAuth();
     const location = useLocation();
     const { lastActivity } = useActivityMonitor();
     const { AUTH_CONFIG } = useAuthConfig();
     
     // Check for inactivity on route changes
     useEffect(() => {
       const now = Date.now();
       const timeSinceLastActivity = now - lastActivity;
       
       // Trigger validation if inactive for the validation threshold time
       if (timeSinceLastActivity > AUTH_CONFIG.validationThresholdMs) {
         validateAuthState();
       }
     }, [location.pathname, lastActivity, validateAuthState, AUTH_CONFIG]);
     
     // Rest of protected route logic
     // ...
   };
   ```

2. **API Request Implementation**:
   ```typescript
   // src/hooks/useApi.ts
   const useApi = (modelName) => {
     const { token, validateAuthState, lastActivity } = useAuth();
     const { AUTH_CONFIG } = useAuthConfig();
     
     // Validate token before important API calls if inactive
     const validateBeforeCall = useCallback(() => {
       const now = Date.now();
       const timeSinceLastActivity = now - lastActivity;
       
       if (timeSinceLastActivity > AUTH_CONFIG.validationThresholdMs) {
         return validateAuthState();
       }
       
       return Promise.resolve();
     }, [lastActivity, validateAuthState, AUTH_CONFIG]);
     
     // Wrap API calls with validation
     const executeApiCall = useCallback(async (method, ...args) => {
       await validateBeforeCall();
       // Execute actual API call
       // ...
     }, [validateBeforeCall]);
     
     // Rest of useApi implementation
     // ...
   };
   ```

### Timeout and Threshold Justification

| Parameter | Default Value | Justification | Configurability |
|-----------|---------------|---------------|-----------------|
| Token Refresh | 20 hours (of 24) | Balances frequency with server load; provides 4-hour buffer before expiry | Yes, via `REACT_APP_TOKEN_REFRESH_BEFORE_HOURS` |
| Inactivity Threshold | 60 minutes | Aligns with typical user break periods; balances security with UX | Yes, via `REACT_APP_INACTIVITY_THRESHOLD_MINUTES` |
| Validation After Inactivity | 30 minutes | Shorter than refresh to catch potential issues early | Yes, via `REACT_APP_VALIDATION_THRESHOLD_MINUTES` |
| Maximum Session Length | 14 days | Industry standard for balancing convenience with security | Yes, via `REACT_APP_MAX_SESSION_DAYS` |
| Background Refresh | 30 minutes before expiry | Provides buffer for network issues while reducing unnecessary refreshes | Yes, calculated from refresh settings |

## Phase Implementation Planning

### Phase 1: Core Authentication
- Authentication service and context
- Login/registration interfaces
- Role-based route protection
- Basic dashboard for each role
- User profile management
- **Comprehensive Client-Side Validation**
- **Token Refresh Strategy Implementation**

### Phase 2: Client Management & Notifications
- Client management interfaces
- Staff assignment functionality
- Notification component with alerts
- Activity feed integration

### Phase 3: Service Management
- Service catalog browsing
- Service purchasing workflow
- Client service access controls
- Service usage analytics

### Phase 4: Billing & Customization
- Invoice display and management
- Subscription handling
- Payment processing
- User preference settings

## Common Pitfalls to Avoid
- Inconsistent token handling across components
- Missing loading states during authentication
- Insufficient error handling for auth failures
- Role permission leakage in the UI
- Excessive re-renders due to auth state changes
- Improper handling of session timeouts
- **Not validating role-clientId relationship consistently**
- **Hardcoding role-based content instead of using permission checks**
- **Neglecting token refresh timing leading to premature logouts**
- **Displaying UI elements before role validation completes**
- **Redundant validation causing performance degradation**
- **Insecure token storage without proper XSS mitigation**
- **Not handling user returns after inactive periods**
- **Missing clear error messaging for authentication failures**

## Testing Strategy
- Unit tests for authentication services
- Integration tests for login/registration flow
- Mock API responses for testing
- Role-based access control testing
- Cross-browser compatibility verification
- **Validation Tests**: Ensure proper role-clientId validation 
- **Timeout Tests**: Verify token refresh and timeout behaviors
- **Error Handling Tests**: Confirm proper handling of all error scenarios
- **Security Tests**: Verify XSS protection measures for token storage
- **Inactivity Tests**: Validate proper handling of dormant sessions
