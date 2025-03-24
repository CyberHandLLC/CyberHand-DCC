# Card Component

## Overview

The `Card` component provides a standardized container with consistent styling, theme awareness, and variant support. It's a versatile building block used throughout the application for grouping related content.

## Why Standardization Was Needed

Prior to the standardized `Card` component, the application had:

- Inconsistent card styling and padding across components
- Duplicate border, shadow, and radius styles
- Varying approaches to card headers and footers
- Inconsistent hover effects
- No standardized variant system for different card types

## Component Interface

```typescript
interface CardProps {
  /** Card title (shown in header if provided) */
  title?: string;
  
  /** Variant affects the card's color scheme */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Whether to include a hover effect */
  hoverable?: boolean;
  
  /** Custom header content (overrides the title) */
  header?: React.ReactNode;
  
  /** Custom footer content */
  footer?: React.ReactNode;
  
  /** Whether to remove padding from the card body */
  noPadding?: boolean;
  
  /** Additional CSS classes for the card container */
  className?: string;
  
  /** Additional CSS classes for the card body */
  bodyClassName?: string;
  
  /** Card content */
  children: React.ReactNode;
  
  /** Click handler for the entire card (makes card interactive) */
  onClick?: () => void;
}
```

## Features

1. **Theme Awareness**: Automatically adapts to light or dark theme
2. **Variant Support**: Multiple color schemes for different contexts
3. **Header & Footer**: Optional header and footer sections
4. **Hover Effects**: Optional hover animation for interactive cards
5. **Flexible Padding**: Option to remove padding for custom layouts
6. **Interactive Mode**: Optional onClick handler for the entire card

## Usage Examples

### Basic Usage

```tsx
import { Card } from '../components/ui/Card';

// Simple card with title
<Card title="User Profile">
  <p>User profile content goes here</p>
</Card>
```

### Card Variants

```tsx
// Default variant
<Card title="Account Information">
  <p>Account details go here</p>
</Card>

// Primary variant
<Card title="Featured Project" variant="primary">
  <p>Project details go here</p>
</Card>

// Success variant
<Card title="Payment Successful" variant="success">
  <p>Your payment was processed successfully</p>
</Card>

// Warning variant
<Card title="Subscription Expiring" variant="warning">
  <p>Your subscription will expire in 3 days</p>
</Card>

// Danger variant
<Card title="Account Overdue" variant="danger">
  <p>Your account is 30 days overdue</p>
</Card>

// Info variant
<Card title="Tips & Tricks" variant="info">
  <p>Helpful information goes here</p>
</Card>
```

### With Custom Header and Footer

```tsx
import { Card } from '../components/ui/Card';
import { MoreVertical, Download } from 'lucide-react';

<Card
  header={
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">Monthly Report</h3>
      <button className="text-gray-500 hover:text-gray-700">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  }
  footer={
    <div className="flex justify-end">
      <button className="flex items-center text-blue-600 hover:text-blue-800">
        <Download className="h-4 w-4 mr-1" />
        Download PDF
      </button>
    </div>
  }
>
  <div className="py-4">
    <p>Report content goes here</p>
  </div>
</Card>
```

### Interactive Card

```tsx
<Card 
  title="Project Overview" 
  hoverable 
  onClick={() => navigate(`/projects/${project.id}`)}
>
  <div className="space-y-2">
    <p className="font-medium">{project.name}</p>
    <p className="text-sm text-gray-500">{project.description}</p>
    <div className="flex items-center text-sm">
      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
      <span>Due {formatDate(project.dueDate)}</span>
    </div>
  </div>
</Card>
```

### Card with No Padding

```tsx
<Card title="Recent Activity" noPadding>
  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
    {activities.map((activity) => (
      <li key={activity.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center">
          <div className="mr-4">
            <UserAvatar user={activity.user} size="sm" />
          </div>
          <div>
            <p className="font-medium">{activity.user.name}</p>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <p className="text-xs text-gray-400">
              <DateDisplay date={activity.timestamp} format="relative" />
            </p>
          </div>
        </div>
      </li>
    ))}
  </ul>
</Card>
```

### Card Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card title="Total Users">
    <p className="text-3xl font-bold">3,254</p>
    <p className="text-sm text-green-600">+12% from last month</p>
  </Card>
  
  <Card title="Active Projects">
    <p className="text-3xl font-bold">28</p>
    <p className="text-sm text-yellow-600">3 due this week</p>
  </Card>
  
  <Card title="Revenue">
    <p className="text-3xl font-bold">$48,350</p>
    <p className="text-sm text-green-600">+8% from last month</p>
  </Card>
</div>
```

## Best Practices

1. **Use consistent variants** for similar content types
2. **Use hoverable only for interactive cards** with onClick handlers
3. **Use noPadding** when implementing custom lists or tables within cards
4. **Maintain consistent spacing** between multiple cards
5. **Use grid layouts** for dashboard card arrangements
6. **Keep card content focused** - each card should represent a single concept

## Migration Guide

To migrate from custom card implementations to the standardized component:

1. Import the Card component
2. Replace custom card containers with the Card component
3. Move header content to the title or header prop
4. Move footer content to the footer prop
5. Add appropriate variant based on the card's purpose

### Before:

```tsx
<div className="bg-white rounded-lg shadow p-4 border border-gray-200">
  <div className="border-b border-gray-200 pb-3 mb-3">
    <h3 className="text-lg font-medium">Payment Methods</h3>
  </div>
  
  <div className="space-y-4">
    {paymentMethods.map(method => (
      <div key={method.id} className="flex items-center justify-between">
        <div className="flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          <span>{method.name}</span>
        </div>
        <Badge>{method.isDefault ? 'Default' : 'Secondary'}</Badge>
      </div>
    ))}
  </div>
  
  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-end">
    <button className="text-blue-600 hover:text-blue-800">
      Add New Payment Method
    </button>
  </div>
</div>
```

### After:

```tsx
import { Card } from '../components/ui/Card';

<Card 
  title="Payment Methods"
  footer={
    <div className="flex justify-end">
      <button className="text-blue-600 hover:text-blue-800">
        Add New Payment Method
      </button>
    </div>
  }
>
  <div className="space-y-4">
    {paymentMethods.map(method => (
      <div key={method.id} className="flex items-center justify-between">
        <div className="flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          <span>{method.name}</span>
        </div>
        <Badge>{method.isDefault ? 'Default' : 'Secondary'}</Badge>
      </div>
    ))}
  </div>
</Card>
```
