# Dashboard Layout System

This document details the standardized dashboard layout system and how it integrates with our application's hooks, API patterns, and authentication.

## Overview

The dashboard layout system provides a consistent structure for all dashboard views in the application while maintaining responsiveness and adhering to DRY principles. It consists of modular components that work together with our existing hooks and API pattern.

![Dashboard Layout Architecture](../assets/dashboard-layout-architecture.png)

## Components

### DashboardLayout

The core component that provides the overall structure for dashboard views.

```tsx
<DashboardLayout
  user={user}
  title="Dashboard Title"
  tabs={dashboardTabs}
  defaultTab="Overview"
  error={error}
  clearError={clearError}
  isLoading={isLoading}
  onRetry={handleRetry}
>
  {/* Dashboard content */}
</DashboardLayout>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | `any` | User data object from AuthContext |
| `title` | `string` | Title displayed in the header |
| `tabs` | `TabConfig[]` \| `string[]` | Dashboard navigation tabs |
| `defaultTab` | `string` | Default active tab |
| `customSubTabs` | `Record<string, string[]>` | Sub-tabs for specific tabs |
| `sidebar` | `ReactNode` | Optional sidebar content |
| `children` | `ReactNode` | Main dashboard content |
| `userMenuItems` | `{ label: string; onClick: () => void }[]` | Additional menu items for user dropdown |
| `error` | `any` | Error from API calls |
| `clearError` | `() => void` | Function to clear error |
| `isLoading` | `boolean` | Loading state indicator |
| `loadingMessage` | `string` | Message to display while loading |
| `onRetry` | `() => void` | Function to retry failed operations |

### DashboardSection

A component for creating consistent dashboard content sections.

```tsx
<DashboardSection
  title="Section Title"
  description="Optional description"
  asCard={true}
  action={<Button>Action</Button>}
>
  {/* Section content */}
</DashboardSection>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Section title |
| `description` | `string` | Optional description |
| `asCard` | `boolean` | Whether to apply card styling |
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Section content |
| `action` | `ReactNode` | Optional action button/element |
| `padding` | `'none' \| 'default' \| 'large'` | Section padding |
| `footer` | `ReactNode` | Optional footer content |

### Grid System

Standardized grid layouts for consistent content arrangement.

```tsx
// Import grid constants
import { dashboardGrid, dashboardSpacing } from '../components/layout/DashboardLayout';

// Usage
<div className={`${dashboardGrid.cols3} ${dashboardSpacing.gridGap}`}>
  <MetricCard title="Total Users" value="1,234" />
  <MetricCard title="Active Users" value="987" />
  <MetricCard title="New Users" value="56" />
</div>
```

#### Available Grid Layouts

| Grid | Description |
|------|-------------|
| `cols1` | Single column layout |
| `cols2` | Two columns (responsive) |
| `cols3` | Three columns (responsive) |
| `cols4` | Four columns (responsive) |
| `sidebar` | Sidebar with main content layout |
| `autofit(minWidth)` | Auto-fitting grid based on min width |

#### Spacing Variables

| Variable | Description |
|----------|-------------|
| `container` | Container padding |
| `section` | Section margin bottom |
| `card` | Card padding |
| `itemGap` | Gap between items |
| `gridGap` | Gap between grid items |

## Integration with Hooks

### Authentication (useAuth)

The DashboardLayout integrates with the authentication system to:

1. Display user information in the header
2. Provide sign-out functionality
3. Restrict access to authorized users

```tsx
// Inside DashboardLayout
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/login');
};
```

### Dashboard Navigation (useDashboardNavigation)

Manages tab and sub-tab state within dashboards.

```tsx
const {
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  currentSubTabs,
  handlePrevSubTab,
  handleNextSubTab
} = useDashboardNavigation(tabNames, defaultTab, customSubTabs);
```

### API Error Handling (useApiError)

The dashboard layout works seamlessly with our API error handling pattern:

1. Automatically displays errors via the ErrorDisplay component
2. Provides retry functionality for failed operations
3. Allows error dismissal

```tsx
// In your dashboard component
const { error, isLoading, handleApiCall, clearError } = useApiError();

// Pass to DashboardLayout
<DashboardLayout
  error={error}
  clearError={clearError}
  isLoading={isLoading}
  onRetry={() => fetchData()}
>
  {/* Dashboard content */}
</DashboardLayout>
```

## Integration with API Pattern

### API Resource Pattern

The dashboard layout works with our standardized API resource pattern:

```tsx
// In your dashboard component
const {
  data,
  isLoading,
  error,
  fetch,
  create,
  update,
  remove,
  clearError
} = useApiResourceWithToast({
  fetchResourceFn: () => api.getItems(),
  createResourceFn: (item) => api.createItem(item),
  updateResourceFn: (id, item) => api.updateItem(id, item),
  deleteResourceFn: (id) => api.deleteItem(id),
  resourceName: 'Item'
});

// Pass to DashboardLayout
<DashboardLayout
  error={error}
  clearError={clearError}
  isLoading={isLoading}
  onRetry={() => fetch()}
>
  {data && (
    <DashboardSection title="Items">
      {/* Render data */}
    </DashboardSection>
  )}
</DashboardLayout>
```

### Loading States

The system handles loading states consistently:

1. Loading state is displayed while data is being fetched
2. Content is only shown when data is available
3. Custom loading messages can be provided

## Usage Example

Here's a complete example of a dashboard using the standardized layout system:

```tsx
import React from 'react';
import DashboardLayout, { dashboardGrid, dashboardSpacing } from '../components/layout/DashboardLayout';
import DashboardSection from '../components/layout/DashboardSection';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import { useApiResourceWithToast } from '../hooks/useApiResourceWithToast';
import { useAuth } from '../context/AuthContext';
import userAPI from '../api/services/userAPI';

const UserDashboard = () => {
  const { user } = useAuth();
  
  // API resource for user metrics
  const {
    data: metrics,
    isLoading,
    error,
    fetch,
    clearError
  } = useApiResourceWithToast({
    fetchResourceFn: () => userAPI.getUserMetrics(user.id),
    resourceName: 'User metrics'
  });
  
  // Dashboard tabs
  const dashboardTabs = [
    { name: "Overview" },
    { name: "Profile", subTabs: ["Personal Info", "Settings", "Security"] },
    { name: "Activity" }
  ];
  
  return (
    <DashboardLayout
      user={user}
      title="User Dashboard"
      tabs={dashboardTabs}
      defaultTab="Overview"
      error={error}
      clearError={clearError}
      isLoading={isLoading}
      onRetry={fetch}
    >
      {metrics && (
        <>
          <DashboardSection 
            title="Performance Metrics" 
            description="Your activity for the current month"
          >
            <div className={`${dashboardGrid.cols3} ${dashboardSpacing.gridGap}`}>
              <MetricCard
                title="Total Logins"
                value={metrics.loginCount}
                icon={<UserIcon />}
                iconColor="blue"
              />
              <MetricCard
                title="Documents Created"
                value={metrics.documentCount}
                icon={<FileIcon />}
                iconColor="green"
              />
              <MetricCard
                title="Active Projects"
                value={metrics.activeProjects}
                icon={<ProjectIcon />}
                iconColor="purple"
              />
            </div>
          </DashboardSection>
          
          <DashboardSection title="Recent Activity">
            <Card>
              {/* Activity content */}
            </Card>
          </DashboardSection>
        </>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
```

## Best Practices

1. **Always wrap dashboard views** with the DashboardLayout component
2. **Use DashboardSection** for content sections to maintain consistent spacing
3. **Use the standardized grid system** for arranging content
4. **Pass error and loading states** from API hooks to the DashboardLayout
5. **Provide retry functionality** for failed API operations
6. **Keep dashboard views focused** on displaying data, not handling layout concerns

## Responsive Behavior

The dashboard layout system is fully responsive:

- **Mobile**: Single column layout with collapsible navigation
- **Tablet**: Two-column layouts for grids
- **Desktop**: Full multi-column layout with standard navigation

## Theme Support

The system supports both light and dark themes:

1. Automatically adapts to the current theme context
2. Provides consistent styling across themes
3. Includes theme toggle functionality

## Troubleshooting

### Common Issues

1. **Dashboard not displaying error messages**
   - Ensure you're passing the error state from useApiError to the DashboardLayout

2. **Tabs not rendering correctly**
   - Check that your tabs array contains valid tab names or TabConfig objects

3. **Grid layout not responsive**
   - Verify you're using the predefined grid classes from dashboardGrid

4. **Content sections inconsistently spaced**
   - Wrap content in DashboardSection components and use dashboardSpacing constants
