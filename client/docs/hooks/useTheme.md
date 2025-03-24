# ThemeContext and useTheme Hook

## Overview

The `ThemeContext` and `useTheme` hook provide a standardized way to manage theme preferences (light/dark) across the application. This system supports automatic detection of system preferences, persistence of theme choices, and a consistent API for theme toggling.

## Why Standardization Was Needed

Prior to the standardized theme management system, the application had:

- Inconsistent theme implementations across components
- Duplicate code for theme toggling in multiple components
- No persistence of user theme preferences
- No support for system theme preferences
- No central theme management

## Component Interface

### ThemeProvider

```typescript
interface ThemeProviderProps {
  /** Initial theme, defaults to system preference */
  initialTheme?: 'light' | 'dark' | 'system';
  
  /** Children components that will have access to the theme context */
  children: React.ReactNode;
}
```

### useTheme Hook

```typescript
interface UseThemeReturn {
  /** Current theme ('light' or 'dark') */
  theme: 'light' | 'dark';
  
  /** Current theme preference ('light', 'dark', or 'system') */
  themePreference: 'light' | 'dark' | 'system';
  
  /** Function to set the theme preference */
  setThemePreference: (theme: 'light' | 'dark' | 'system') => void;
  
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}
```

## Features

1. **Theme Detection**: Automatically detects and uses system theme preference
2. **Theme Persistence**: Saves theme preference to localStorage
3. **Central Management**: Provides a single source of truth for theme state
4. **Simple API**: Easy-to-use hook for accessing and modifying theme
5. **System Preference Support**: Tracks changes to system theme preference
6. **Flexibility**: Supports explicit light/dark preference or system sync

## Usage Examples

### Setting Up the Provider

```tsx
// In your root component (e.g., App.tsx)
import { ThemeProvider } from '../context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        {/* Your application content */}
      </div>
    </ThemeProvider>
  );
}
```

### Using the Theme Hook

```tsx
import { useTheme } from '../hooks/useTheme';

function ThemeSensitiveComponent() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

### Theme Toggle Button

```tsx
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
```

### Theme Preference Selector

```tsx
import { useTheme } from '../hooks/useTheme';

function ThemePreferenceSelector() {
  const { themePreference, setThemePreference } = useTheme();
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Theme Preference</h3>
      
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={themePreference === 'light'}
            onChange={() => setThemePreference('light')}
            className="mr-2"
          />
          Light
        </label>
        
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={themePreference === 'dark'}
            onChange={() => setThemePreference('dark')}
            className="mr-2"
          />
          Dark
        </label>
        
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="system"
            checked={themePreference === 'system'}
            onChange={() => setThemePreference('system')}
            className="mr-2"
          />
          System
        </label>
      </div>
    </div>
  );
}
```

### Class-based Theme Implementation

```tsx
import { useTheme } from '../hooks/useTheme';
import clsx from 'clsx';

function ThemedCard({ title, children }) {
  const { theme } = useTheme();
  
  return (
    <div
      className={clsx(
        'rounded-lg p-4 shadow',
        theme === 'dark' 
          ? 'bg-gray-800 text-gray-100' 
          : 'bg-white text-gray-900'
      )}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
```

### Tailwind Dark Mode Integration

When using Tailwind CSS, you can leverage the `dark:` variant with the theme context:

```tsx
// In your root component or layout
import { useTheme } from '../hooks/useTheme';

function Layout({ children }) {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </div>
    </div>
  );
}
```

Then in your components, you can use Tailwind's dark mode variants:

```tsx
function Button({ children }) {
  return (
    <button className="bg-blue-600 dark:bg-blue-800 text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}
```

## Best Practices

1. **Use the useTheme hook** for all theme-dependent styling
2. **Apply the theme class at the highest level** possible
3. **Provide fallbacks** for when ThemeContext is not available
4. **Use semantic color variables** instead of hardcoded colors
5. **Test both themes** for all components
6. **Remember to add dark mode styles** for all custom components

## Migration Guide

To migrate from custom theme implementations to the standardized context:

1. Add the ThemeProvider to your root component
2. Replace custom theme toggles with the useTheme hook
3. Update components to use the theme value from the hook

### Before:

```tsx
// Custom theme implementation
import { useState, useEffect } from 'react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  return (
    <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      {/* App content */}
    </div>
  );
}
```

### After:

```tsx
// Using the standardized ThemeContext
import { ThemeProvider } from '../context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      {/* App content */}
    </div>
  );
}
```
