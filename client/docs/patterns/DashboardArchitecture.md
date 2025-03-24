# Dashboard Architecture

This document outlines the dashboard architecture used throughout the CyberHand application.

## Overview

The dashboard system follows a role-based architecture that provides different views and functionality based on the user's role while maintaining a consistent UI pattern across all roles.

### Core Components

#### StandardDashboard

The `StandardDashboard` component serves as the main entry point for all dashboard experiences. It:

1. Reads the current user's role from the `AuthContext`
2. Selects the appropriate dashboard content component based on role
3. Handles basic authentication logic (redirects to login if not authenticated)
4. Manages theme consistency with the `ThemeContext`

```tsx
// Simplified example of StandardDashboard
const StandardDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();
  
  // Loading state handling...
  
  // Role-based component selection
  switch(user?.role) {
    case 'admin':
      return <AdminDashboardContent user={user} />;
    case 'staff':
      return <StaffDashboardContent user={user} />;
    case 'client':
      return <ClientDashboardContent user={user} />;
    case 'observer':
      return <ObserverDashboardContent user={user} />;
    default:
      return <ClientDashboardContent user={user} />; // Fallback
  }
};
```

#### Role-Specific Dashboard Content Components

Each role has a dedicated dashboard content component:

1. `AdminDashboardContent` - For administrators
2. `StaffDashboardContent` - For staff members
3. `ClientDashboardContent` - For clients
4. `ObserverDashboardContent` - For observers (view-only role)

These components follow a consistent structure:

- Header with role identifier and user menu
- Tab-based navigation (desktop)
- Arrow-based navigation (mobile)
- Sub-tab system for complex sections
- Standardized error handling
- Consistent loading states

### Navigation System

#### Desktop Navigation

Desktop navigation uses horizontal tabs with the following features:

- Visual indicators for the active tab
- Theme-aware styling
- Consistent spacing and sizing

#### Mobile Navigation

Mobile navigation follows the arrow-based pattern:

- Left/right arrows to navigate between tabs
- Current tab displayed prominently in the center
- Consistent touch targets (min 44px)

#### Sub-Tab Navigation

For sections with multiple sub-views:

- Horizontal secondary navigation below main tabs
- Arrow-based navigation on mobile
- Automatic handling of sub-tab state

### Routing Structure

Dashboard routing is handled by `DashboardRoutes.tsx`, which:

1. Sets up role-based protected routes
2. Defines the route hierarchy for each role
3. Handles nested routing for detailed views

## Implementation Details

### User Menu

All dashboards include a user menu that:

- Displays the user's name
- Provides access to profile settings
- Includes a theme toggle
- Contains a logout option
- Adapts for mobile and desktop layouts

### Error Handling

Dashboard components use the standardized error handling pattern:

- `useApiError` hook for managing API errors
- `ErrorDisplay` component for displaying errors
- Consistent retry functionality
- Loading states during API calls

### Responsive Design

All dashboard components are fully responsive with:

- Grid-based layouts that adapt to screen size
- Mobile-first design approach
- Consistent breakpoints (sm, md, lg)
- Touch-friendly controls on mobile

## Usage Example

To add a new section to a role-specific dashboard:

1. Add the new tab name to the tabs array
2. Add any sub-tabs to the customSubTabs object if needed
3. Create a new conditional rendering block for the tab content
4. Add necessary API calls using the useApiError hook

```tsx
// Example of adding a new tab
const tabs = ["Overview", "Clients", "Services", "Users", "Reports", "New Section"];

const customSubTabs = {
  // Add sub-tabs for the new section
  "New Section": ["Overview", "Details", "Settings"]
};

// Later in the render function
{activeTab === "New Section" && (
  <div>
    <h2>New Section</h2>
    {/* Sub-tab content */}
    {activeSubTab === "Overview" && <NewSectionOverview />}
    {activeSubTab === "Details" && <NewSectionDetails />}
    {activeSubTab === "Settings" && <NewSectionSettings />}
  </div>
)}
```
