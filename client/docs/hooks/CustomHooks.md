# Custom Hooks Reference

This document provides detailed information about the custom hooks used throughout the CyberHand application.

## Overview

Custom hooks in the application follow React's composable hooks pattern to extract and reuse stateful logic. They help maintain a consistent approach to common tasks across components.

## Core Hooks

### useApiError

The `useApiError` hook provides standardized error handling for API calls.

#### Usage

```tsx
const { error, isLoading, handleApiCall, clearError } = useApiError();

// Example usage with API call
const fetchData = async () => {
  await handleApiCall(async () => {
    const response = await api.getData();
    setData(response.data);
  });
};

// In component render
if (isLoading) {
  return <LoadingState />;
}

if (error) {
  return (
    <ErrorDisplay 
      error={error} 
      onDismiss={clearError} 
      onRetry={fetchData} 
    />
  );
}
```

#### Implementation

```tsx
export const useApiError = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async (apiCall: () => Promise<any>) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiCall();
    } catch (err) {
      const apiError = formatApiError(err);
      setError(apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  const clearError = () => setError(null);

  return { error, isLoading, handleApiCall, clearError };
};
```

### useTheme

The `useTheme` hook provides access to theme state and toggle functionality.

#### Usage

```tsx
const { theme, toggleTheme } = useTheme();

// Using theme in styles
<div className={`${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
  Content
</div>

// Toggle button
<button onClick={toggleTheme}>
  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
</button>
```

#### Implementation

```tsx
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### useDashboardNavigation

The `useDashboardNavigation` hook manages tab and sub-tab navigation for dashboards.

#### Usage

```tsx
const tabs = ["Overview", "Projects", "Tasks"];
const customSubTabs = {
  "Projects": ["Active", "Completed", "Archived"],
  "Tasks": ["Assigned", "In Progress", "Completed"]
};

const { 
  activeTab, 
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  currentSubTabs,
  handlePrevTab,
  handleNextTab,
  handlePrevSubTab,
  handleNextSubTab
} = useDashboardNavigation(tabs, "Overview", customSubTabs);

// In render function
// Main tab navigation
<div className="flex">
  {tabs.map(tab => (
    <button 
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={activeTab === tab ? 'active' : ''}
    >
      {tab}
    </button>
  ))}
</div>

// Sub-tab navigation (only shown when there are sub-tabs)
{currentSubTabs.length > 0 && (
  <div className="flex">
    {currentSubTabs.map(subTab => (
      <button
        key={subTab}
        onClick={() => setActiveSubTab(subTab)}
        className={activeSubTab === subTab ? 'active' : ''}
      >
        {subTab}
      </button>
    ))}
  </div>
)}

// Mobile navigation with arrows
<div className="flex md:hidden">
  <button onClick={handlePrevTab}>←</button>
  <span>{activeTab}</span>
  <button onClick={handleNextTab}>→</button>
</div>
```

#### Implementation

```tsx
export const useDashboardNavigation = (
  tabs: string[],
  defaultTab: string,
  customSubTabs: Record<string, string[]> = {}
) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeSubTab, setActiveSubTab] = useState('');
  
  // Get current sub-tabs based on active tab
  const currentSubTabs = useMemo(() => {
    return customSubTabs[activeTab] || [];
  }, [activeTab, customSubTabs]);
  
  // Set default sub-tab when active tab changes
  useEffect(() => {
    if (currentSubTabs.length > 0) {
      setActiveSubTab(currentSubTabs[0]);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab, currentSubTabs]);
  
  // Navigation handlers
  const handlePrevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  
  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const handlePrevSubTab = () => {
    const currentIndex = currentSubTabs.indexOf(activeSubTab);
    if (currentIndex > 0) {
      setActiveSubTab(currentSubTabs[currentIndex - 1]);
    }
  };
  
  const handleNextSubTab = () => {
    const currentIndex = currentSubTabs.indexOf(activeSubTab);
    if (currentIndex < currentSubTabs.length - 1) {
      setActiveSubTab(currentSubTabs[currentIndex + 1]);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    currentSubTabs,
    handlePrevTab,
    handleNextTab,
    handlePrevSubTab,
    handleNextSubTab
  };
};
```

### useClickOutside

The `useClickOutside` hook detects clicks outside a specified element.

#### Usage

```tsx
const menuRef = useRef<HTMLDivElement>(null);
const [isOpen, setIsOpen] = useState(false);

// Close when clicking outside
useClickOutside(menuRef, () => {
  setIsOpen(false);
});

return (
  <div>
    <button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
    {isOpen && (
      <div ref={menuRef} className="dropdown-menu">
        Menu content
      </div>
    )}
  </div>
);
```

#### Implementation

```tsx
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
```

## Utility Hooks

### useLocalStorage

The `useLocalStorage` hook provides persistent state using localStorage.

#### Usage

```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light');

// Use like normal state
setTheme('dark');
```

#### Implementation

```tsx
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue] as const;
};
```

### useMediaQuery

The `useMediaQuery` hook detects if a media query matches.

#### Usage

```tsx
const isDesktop = useMediaQuery('(min-width: 1024px)');

return (
  <div>
    {isDesktop ? (
      <DesktopNavigation />
    ) : (
      <MobileNavigation />
    )}
  </div>
);
```

#### Implementation

```tsx
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
};
```

## Best Practices

1. **Rule of Hooks**: Always follow React's rules of hooks - only call hooks at the top level and from React functions.

2. **Naming Convention**: Prefix custom hooks with `use` to clearly identify them as hooks.

3. **Documentation**: Document the purpose, parameters, and return values of each hook.

4. **Testing**: Write unit tests for hooks using `@testing-library/react-hooks`.

5. **Composition**: Build complex hooks by composing simpler hooks.

6. **Error Handling**: Include appropriate error handling and fallbacks in hooks.

7. **Performance**: Be mindful of dependencies in `useEffect` to prevent unnecessary re-renders.
