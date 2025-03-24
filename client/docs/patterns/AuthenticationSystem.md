# Authentication System

This document explains the authentication system used in the CyberHand application.

## Overview

The authentication system is built around React Context, providing application-wide access to authentication state and functionality. It handles user authentication, session management, and role-based access control.

## Core Components

### AuthContext and AuthProvider

The `AuthContext` and its provider (`AuthProvider`) form the foundation of the authentication system:

```tsx
// Simplified AuthContext
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Authentication methods
  const login = async (email: string, password: string) => {/* ... */};
  const logout = async () => {/* ... */};
  const register = async (userData: RegisterData) => {/* ... */};
  
  // Session checking
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Context value
  const value = { user, isLoading, login, logout, register };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### useAuth Hook

The `useAuth` hook provides convenient access to the AuthContext:

```tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### ProtectedRoute Component

The `ProtectedRoute` component implements role-based access control:

```tsx
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isLoading } = useAuth();
  
  // Handle loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRoles && !requiredRoles.includes(user.role.toUpperCase())) {
    return <Navigate to="/unauthorized" />;
  }
  
  // User is authenticated and authorized
  return <>{children}</>;
};
```

## Authentication Flow

### Login Process

1. User enters credentials in the `Login` component
2. Component calls `login()` method from `useAuth()`
3. `AuthProvider` makes API request to authentication endpoint
4. On success:
   - User data is stored in state
   - JWT token is stored in localStorage
   - User is redirected to dashboard
5. On failure:
   - Error is displayed using `ErrorDisplay`
   - User remains on login page

### Session Persistence

1. `AuthProvider` checks for existing token on initialization
2. If token exists, it validates with backend
3. If valid, user state is populated
4. If invalid, token is removed and user remains logged out

### Logout Process

1. User triggers logout (typically from user menu)
2. `logout()` method is called from `useAuth()`
3. Token is removed from localStorage
4. User state is cleared
5. User is redirected to login page

## Role-Based Access Control

The application implements role-based access using multiple mechanisms:

### Route Protection

`ProtectedRoute` component checks user role against required roles:

```tsx
<Route 
  path="admin/*" 
  element={
    <ProtectedRoute requiredRoles={['ADMIN']}>
      {/* Admin routes */}
    </ProtectedRoute>
  } 
/>
```

### Conditional Rendering

Components can conditionally render elements based on user role:

```tsx
const { user } = useAuth();
const isAdmin = user?.role === 'ADMIN';

return (
  <div>
    {isAdmin && <AdminOnlyControls />}
    <CommonControls />
  </div>
);
```

## Security Considerations

### Token Storage

- JWTs are stored in localStorage
- Tokens include expiration time
- Refresh token mechanism for extending sessions

### CSRF Protection

- API requests include CSRF tokens for state-changing operations
- Server validates tokens to prevent CSRF attacks

### Session Timeout

- Automatic logout after period of inactivity
- Configurable timeout duration

## Integration with Dashboard

The authentication system integrates tightly with the dashboard architecture:

1. `StandardDashboard` uses `useAuth()` to get user data and role
2. Role determines which dashboard content component is rendered
3. All dashboard routes are wrapped in `ProtectedRoute`
4. User menu includes logout functionality from `useAuth()`
