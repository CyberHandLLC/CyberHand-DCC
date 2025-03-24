# Dashboard Migration Guide

This guide explains how to transition from the legacy dashboard implementation to our new standardized dashboard layout and components.

## Overview

The CyberHand application has been updated to use a standardized dashboard layout pattern across all user roles, providing the following benefits:

- **Consistent User Experience**: All dashboards follow the same layout patterns and interaction models
- **Standardized Components**: Reuse of common components like `MetricCard`, `DashboardSection`, and `Icon`
- **Theme Support**: Consistent light and dark mode implementation across all dashboard views
- **Improved Maintainability**: Centralized layout logic and standardized patterns reduce code duplication
- **Responsive Design**: Consistent mobile experience across all dashboard types

## Migration Path

### Already Migrated
1. Main `App.tsx` now uses the new `StandardDashboard` component
2. All role-specific dashboards have been migrated to content-only components:
   - `ClientDashboardContent`
   - `AdminDashboardContent` 
   - `StaffDashboardContent`
   - `ObserverDashboardContent`

### Components to Use

When building dashboard views, use these standardized components:

#### Layout Components
- `DashboardLayout`: Main container for all dashboard views
- `DashboardSection`: Section container with consistent spacing and optional title

#### UI Components
- `Card`: Container for dashboard content sections
- `MetricCard`: Display metrics with optional trend indicators
- `Icon`: Standardized icon usage with variants
- `IconText`: Display icons with text
- `IconButton`: Button with icon styling
- `LoadingState`: Consistent loading indicators

#### Hooks
- `useDashboardNavigation`: Handles tab navigation logic
- `useApiResource`: Standardized CRUD operations
- `useApiError`: Error handling for API calls

## Implementation Examples

### Dashboard Layout Usage

```tsx
<DashboardLayout
  title="Admin Dashboard"
  user={user}
  tabs={["Overview", "Users", "Settings"]}
>
  {/* Dashboard content goes here */}
</DashboardLayout>
```

### Dashboard Section Usage

```tsx
<DashboardSection title="Performance Metrics">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard 
      title="Visitors" 
      value="1,234" 
      icon={<Icon icon={Users} variant="primary" />}
      trend={{
        value: "+12%",
        label: "from last month",
        direction: "up"
      }}
    />
    {/* More metrics */}
  </div>
</DashboardSection>
```

### Dashboard Navigation

```tsx
const { 
  activeTab, 
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  currentSubTabs
} = useDashboardNavigation(
  ["Overview", "Clients", "Services"],
  "Overview",
  {
    "Clients": ["All Clients", "Active", "Inactive"],
    "Services": ["All Services", "Active", "Pending"]
  }
);

// Render content based on active tab
const renderContent = () => {
  switch (activeTab) {
    case "Overview":
      return <OverviewContent />;
    case "Clients":
      return <ClientsContent activeSubTab={activeSubTab} />;
    // Additional tabs
  }
};
```

## Error Handling Pattern

All dashboard views should implement our standardized error handling pattern:

```tsx
const { error, isLoading, handleApiCall, clearError } = useApiError();

// In component body
if (error) {
  return (
    <DashboardSection>
      <ErrorDisplay 
        error={error} 
        onDismiss={clearError} 
        onRetry={() => fetchData()} 
      />
    </DashboardSection>
  );
}

if (isLoading) {
  return <LoadingState message="Loading data..." />;
}
```

## Best Practices

1. **Consistent Grid System**: Use the grid system with responsive breakpoints:
   ```tsx
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
   ```

2. **Icon Standards**: Use the standardized Icon component with variants:
   ```tsx
   <Icon icon={BarChart} variant="primary" />
   ```

3. **Section Organization**: Group related content in DashboardSection components

4. **Loading States**: Use LoadingState for consistent loading indicators

5. **Error Handling**: Implement the standardized error handling pattern

## Legacy Code Reference

The original dashboard implementation can be found in these files (for reference only):
- `Dashboard.tsx`
- `ClientDashboard.tsx`
- `AdminDashboard.tsx`
- `StaffDashboard.tsx`
- `ObserverDashboard.tsx`
