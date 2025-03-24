# Component Standards & Guidelines

## Introduction

This document serves as a central reference for all standardized components and patterns in the CyberHand application. Following these standards ensures consistency across the application, reduces code duplication, and improves developer productivity.

## Table of Contents

1. [Component Documentation](#component-documentation)
2. [Design Principles](#design-principles)
3. [Naming Conventions](#naming-conventions)
4. [Directory Structure](#directory-structure)
5. [Migration Strategy](#migration-strategy)
6. [Common Issues & Solutions](#common-issues--solutions)

## Component Documentation

Detailed documentation for each standardized component can be found in the following files:

### UI Components

- [DateDisplay](./components/DateDisplay.md) - For standardized date formatting
- [Form Components](./components/Form.md) - For standardized form handling
- [FormInput](./components/FormInput.md) - For standardized form input fields
- [UserMenu](./components/UserMenu.md) - For user profile dropdown menus
- [Card](./components/Card.md) - For consistent content containers
- [MetricCard](./components/MetricCard.md) - For dashboard metrics and KPIs
- [BaseHero](./components/BaseHero.md) - For marketing and landing page hero sections
- [ErrorDisplay](./patterns/ErrorHandling.md) - For standardized error display

### Custom Hooks

- [useFormValidation](./components/Form.md) - For standardized form validation
- [useApiError](./patterns/ErrorHandling.md) - For standardized API error handling
- [useTheme](./hooks/useTheme.md) - For theme management

## Design Principles

All standardized components follow these core principles:

1. **Consistency First**: Components maintain consistent behavior and appearance across the application
2. **Theme Awareness**: Components respect the user's theme preference (light or dark)
3. **Accessibility**: Components include proper ARIA attributes and keyboard navigation
4. **Responsiveness**: Components adapt appropriately to different screen sizes
5. **Error Handling**: Components gracefully handle edge cases and errors
6. **Minimalism**: Components avoid unnecessary props and complexity

## Naming Conventions

To maintain consistency in the codebase, follow these naming conventions:

### Component Names

- Use PascalCase for component names: `DateDisplay`, `FormItem`
- Use descriptive, functional names: `UserMenu` rather than `Dropdown`
- Prefix internal components with component name: `FormItem`, `FormSubmit`

### Props

- Use camelCase for prop names: `onSubmit`, `isLoading`
- Use boolean props with "is", "has", or "should" prefixes: `isRequired`, `hasError`
- Use consistent naming across similar components:
  - `onChange` for change handlers
  - `onSubmit` for submission handlers
  - `onDismiss` for dismissal handlers

### Hooks

- Prefix custom hooks with "use": `useFormValidation`, `useApiError`
- Return objects with consistent property names:
  - `isLoading` for loading states
  - `error` for error states
  - `handleX` for event handlers

## Directory Structure

Standardized components follow this directory structure:

```
client/
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── DateDisplay.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── ...
│   ├── hooks/                # Custom hooks
│   │   ├── useFormValidation.ts
│   │   ├── useApiError.ts
│   │   └── ...
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts
│   │   └── ...
│   ├── context/              # React context providers
│   │   ├── ThemeContext.tsx
│   │   └── ...
│   ├── examples/             # Example implementations
│   │   ├── DateFormatExample.tsx
│   │   └── ...
```

## Migration Strategy

To migrate existing components to use the standardized patterns:

1. **Identify Components**: Review code for custom implementations of common patterns
2. **Prioritize**: Start with high-impact, frequently used components
3. **Implement**: Replace custom code with standardized components
4. **Test**: Thoroughly test the migrated components
5. **Document**: Update documentation to reflect changes

Use the migration guides in each component's documentation for specific guidance.

## Common Issues & Solutions

### Theme Compatibility

**Issue**: Component doesn't adapt to theme changes  
**Solution**: Ensure the component uses the `useTheme` hook and applies appropriate class names

```tsx
const { theme } = useTheme();

// Use theme-conditional classes
const className = theme === 'light' 
  ? 'bg-white text-gray-900' 
  : 'bg-gray-800 text-white';
```

### Form Field Validation

**Issue**: Form fields validate at the wrong time  
**Solution**: Ensure validation only shows after field is touched

```tsx
<FormItem 
  label="Email" 
  error={touched.email && errors.email} // Only show error if touched
  required
>
  <input
    name="email"
    value={values.email}
    onChange={handleChange}
    onBlur={handleBlur} // Important for tracking touched state
  />
</FormItem>
```

### Date Formatting Inconsistencies

**Issue**: Dates display inconsistently across the application  
**Solution**: Always use the DateDisplay component for displaying dates

```tsx
// Don't do this
<div>{new Date(timestamp).toLocaleDateString()}</div>

// Do this instead
<DateDisplay date={timestamp} format="short" />
```

### API Error Handling

**Issue**: Error handling is inconsistent or missing  
**Solution**: Always use the useApiError hook for API calls

```tsx
const { error, isLoading, handleApiCall, clearError } = useApiError();

// Wrap all API calls
const fetchData = async () => {
  await handleApiCall(
    () => api.getData(),
    {
      onSuccess: (data) => setData(data),
      context: 'Loading data' // Always provide context
    }
  );
};
```
