# DateDisplay Component

## Overview

The `DateDisplay` component provides a standardized approach to date formatting across the application. It wraps the JavaScript `Intl` API with a consistent interface, proper theming, and robust fallback handling.

## Why Standardization Was Needed

Prior to the `DateDisplay` component, the application had multiple custom implementations of date formatting functions across different components. This led to:

- Inconsistent date formats in different parts of the application
- Duplicate code for similar date formatting patterns
- Inconsistent handling of null or invalid dates
- No standardized theming for date displays
- Poor semantic HTML (dates were not using proper `<time>` elements)

## Component Interface

```typescript
interface DateDisplayProps {
  /** Date to display (string, Date object, timestamp) */
  date: string | Date | number | null | undefined;
  
  /** Format style to use (defaults to 'short') */
  format?: 'short' | 'medium' | 'long' | 'relative' | 'custom';
  
  /** Whether to include time in the display */
  showTime?: boolean;
  
  /** Text to display when date is null/undefined */
  fallback?: string;
  
  /** Custom format options (only used with format='custom') */
  formatOptions?: Intl.DateTimeFormatOptions;
  
  /** Additional CSS classes to apply */
  className?: string;
}
```

## Usage Examples

### Basic Usage

```tsx
// Import the component
import DateDisplay from '../components/ui/DateDisplay';

// In your JSX
<DateDisplay date={project.dueDate} />
```

### Different Formats

```tsx
// Short format (default)
<DateDisplay date="2025-03-23T16:30:00Z" />
// Output: Mar 23, 2025

// Medium format
<DateDisplay date="2025-03-23T16:30:00Z" format="medium" />
// Output: March 23, 2025

// With time
<DateDisplay date="2025-03-23T16:30:00Z" showTime={true} />
// Output: Mar 23, 2025, 4:30 PM

// Relative format
<DateDisplay date="2025-03-23T16:30:00Z" format="relative" />
// Output: in 5 days (or) 2 hours ago (depending on current time)
```

### Handling Null Values

```tsx
// With default fallback
<DateDisplay date={null} />
// Output: N/A

// With custom fallback
<DateDisplay date={null} fallback="Not available" />
// Output: Not available
```

### Custom Formatting

```tsx
// Custom formatting options
<DateDisplay 
  date="2025-03-23T16:30:00Z"
  format="custom"
  formatOptions={{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }}
/>
// Output: Sunday, March 23, 2025
```

### Styling

```tsx
// With additional styling
<DateDisplay 
  date="2025-03-23T16:30:00Z"
  className="text-blue-600 font-semibold"
/>
```

## Using with Formatters Utility

The `formatters.ts` utility file provides helper functions that work with the `DateDisplay` component:

```tsx
import { dateFormatters } from '../utils/formatters';

// Format as string
const formattedDate = dateFormatters.short(project.dueDate);
// Output: "Mar 23, 2025"

// Format with time
const formattedDateTime = dateFormatters.withTime(project.dueDate);
// Output: "Mar 23, 2025, 4:30 PM"

// Format as relative time
const relativeTime = dateFormatters.relative(project.dueDate);
// Output: "in 5 days" or "2 hours ago"
```

## Best Practices

1. **Always use DateDisplay** for displaying dates in the UI
2. **Use format="relative"** for timestamps (e.g., "Posted 2 hours ago")
3. **Use showTime={true}** when time precision is important
4. **Provide meaningful fallbacks** for nullable date fields
5. **Use the dateFormatters utility** for string-based formatting in non-UI contexts

## Migration Guide

To migrate from custom date formatting to the standardized component:

1. Import the `DateDisplay` component at the top of your file
2. Replace custom date formatting logic with the appropriate `DateDisplay` component
3. For non-UI formatting, use the `dateFormatters` utility functions

### Before:

```tsx
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// In JSX
<div>{formatDate(project.dueDate)}</div>
```

### After:

```tsx
import DateDisplay from '../components/ui/DateDisplay';

// In JSX
<DateDisplay date={project.dueDate} format="short" />
```
