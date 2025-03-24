# UserMenu Component

## Overview

The `UserMenu` component provides a standardized dropdown menu for user profile information, theme toggling, and logout functionality. It ensures a consistent user experience across all parts of the application where user account interactions are needed.

## Why Standardization Was Needed

Prior to the standardized `UserMenu` component, the application had:

- Multiple implementations of user menus with inconsistent behavior
- Duplicate code for handling user data and avatars
- Inconsistent theme toggle locations
- Varying menu styles and positioning
- Poor handling of nullable user objects

## Component Interface

```typescript
interface UserMenuProps {
  /** User object - can be null when user is not logged in */
  user: User | null;
  
  /** Handler for logout action */
  onLogout: () => void;
  
  /** Additional CSS classes */
  className?: string;
}

interface User {
  id: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role?: string;
}
```

## Features

1. **Flexible User Data Handling**: Works with different user object structures
2. **Theme Toggle Integration**: Built-in dark/light mode toggle using ThemeContext
3. **Dropdown Menu**: Click-outside behavior for closing the menu
4. **Accessibility Support**: Properly implemented ARIA attributes
5. **Fallback Avatars**: Uses initials when no avatar image is available
6. **Null User Handling**: Gracefully handles cases where user is null
7. **Theme Awareness**: Automatically adapts to light or dark theme
8. **Display Name Logic**: Smart fallbacks for missing user name data

## Usage Examples

### Basic Usage

```tsx
import UserMenu from '../components/ui/UserMenu';

// In your component
function Header() {
  const { user } = useAuth();
  
  const handleLogout = () => {
    // Logout logic
    logout();
  };
  
  return (
    <header className="flex justify-between items-center p-4">
      <Logo />
      
      <UserMenu 
        user={user}
        onLogout={handleLogout}
        className="z-50"
      />
    </header>
  );
}
```

### Conditionally Rendering UserMenu

```tsx
<header className="flex justify-between items-center p-4">
  <Logo />
  
  {user ? (
    <UserMenu 
      user={user}
      onLogout={handleLogout}
      className="z-50"
    />
  ) : (
    <Button onClick={navigateToLogin}>Login</Button>
  )}
</header>
```

### With Custom Styling

```tsx
<UserMenu 
  user={user} 
  onLogout={handleLogout} 
  className="z-50 shadow-xl"
/>
```

### With Nullable User

```tsx
// The component handles null user objects gracefully
<UserMenu 
  user={isAuthenticated ? user : null} 
  onLogout={handleLogout}
/>
```

## Component Customization

While the UserMenu component is designed to be used as-is in most cases, you can customize its appearance through CSS classes:

```tsx
<UserMenu 
  user={user}
  onLogout={handleLogout}
  className="custom-menu-class"
/>
```

## Best Practices

1. **Always use UserMenu** for user profile menus to maintain consistency
2. **Provide complete user objects** with all available fields for best display
3. **Place in top-right corner** of layouts for consistent positioning
4. **Use with appropriate z-index** to ensure proper layering (z-50 recommended)
5. **Always provide an onLogout handler** that properly handles session termination
6. **Pass the entire user object** rather than individual properties
7. **Handle the onLogout callback** at the parent component level
8. **Set appropriate z-index** when using with other dropdowns
9. **Verify user data** before passing to the component

## Integration with ThemeContext

The UserMenu component integrates with the ThemeContext to handle theme toggling:

```tsx
// Inside UserMenu component (simplified)
const { theme, toggleTheme } = useTheme();

// Theme toggle button in the dropdown
<button onClick={toggleTheme} className="menu-item">
  {theme === 'dark' ? (
    <>
      <Sun className="h-5 w-5 mr-2" />
      <span>Light Mode</span>
    </>
  ) : (
    <>
      <Moon className="h-5 w-5 mr-2" />
      <span>Dark Mode</span>
    </>
  )}
</button>
```

## Name Display Logic

The UserMenu implements smart fallback logic for displaying user names:

```typescript
// Pseudo-code for the name display logic
const displayName = user
  ? user.fullName || user.username || user.email?.split('@')[0] || 'User'
  : 'Guest';
```

## Migration Guide

To migrate from custom user menu implementations to the standardized component:

1. Import the UserMenu component
2. Replace custom user menu implementations with the UserMenu component
3. Pass the user object and logout handler

### Before:

```tsx
<div className="relative">
  <button 
    onClick={() => setIsOpen(!isOpen)}
    className="flex items-center space-x-2 rounded-full bg-gray-100 p-2"
  >
    <img 
      src={user?.profilePicture || '/default-avatar.png'} 
      alt="Profile" 
      className="h-8 w-8 rounded-full"
    />
    <span>{user?.name || 'User'}</span>
  </button>
  
  {isOpen && (
    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Profile
        </a>
        <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Settings
        </a>
        <button 
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  )}
</div>
```

### After:

```tsx
import { UserMenu } from '../components/ui/UserMenu';

<UserMenu user={user} onLogout={handleLogout} />
