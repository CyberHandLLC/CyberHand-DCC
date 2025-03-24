# CyberHand Application Documentation

This directory contains comprehensive documentation for the CyberHand client application. Use this guide to navigate the various sections of documentation.

## Table of Contents

### Architecture Patterns

1. [Dashboard Architecture](./patterns/DashboardArchitecture.md) - Complete guide to the dashboard system
2. [Authentication System](./patterns/AuthenticationSystem.md) - Documentation of the auth system and RBAC

### Components

1. Standardized UI Components
   - Card Component
   - MetricCard Component
   - FormInput Component
   - ErrorDisplay Component

### Custom Hooks

1. [Custom Hooks Reference](./hooks/CustomHooks.md) - Comprehensive guide to all custom hooks
2. [useTheme Hook](./hooks/useTheme.md) - Details on theme management

### Migrations and Cleanup

1. [Dashboard Migration](./migrations/DashboardMigration.md) - Migration from legacy to standardized dashboards
2. [Dashboard Cleanup](./migrations/DashboardCleanup.md) - Cleanup of legacy dashboard components

## Development Standards

### Mobile Standards

The application follows consistent mobile-first development patterns:

- Arrow-based tab navigation for mobile interfaces
- Consistent touch targets (min 44px)
- Responsive layouts with appropriate breakpoints
- Appropriate handling of varying screen sizes

### Error Handling

All components implement the standardized error handling pattern:

- Use of `useApiError` hook for managing API errors
- Consistent error display with retry functionality
- Appropriate loading states during async operations

### Theming

The application uses a consistent theming approach:

- Theme toggle available in all user interfaces
- Dark and light theme support across all components
- Theme persistence via localStorage
- System preference detection

## Contributing to Documentation

When adding new documentation:

1. Place it in the appropriate directory based on its category
2. Update this README to include a link to the new documentation
3. Follow the existing formatting and style conventions
4. Include code examples where appropriate
5. Reference related documentation when relevant

## Best Practices

This codebase follows these best practices:

1. **Component Organization**: Components are organized by feature, then by role
2. **Type Safety**: Comprehensive TypeScript types for all components and functions
3. **Error Handling**: Consistent error handling patterns application-wide
4. **Responsive Design**: Mobile-first design approach with consistent breakpoints
5. **Performance Optimization**: Careful management of re-renders and dependencies
6. **Accessibility**: ARIA attributes and keyboard navigation support
7. **Testing**: Component and hook unit testing

For detailed implementation guidelines, refer to the specific documentation sections.
