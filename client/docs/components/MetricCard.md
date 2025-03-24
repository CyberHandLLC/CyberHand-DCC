# MetricCard Component

## Overview

The `MetricCard` component provides a standardized way to display numeric metrics and statistics with consistent styling, icon support, and theme awareness. It's primarily used in dashboards to highlight key performance indicators.

## Why Standardization Was Needed

Prior to the standardized `MetricCard` component, the application had:

- Inconsistent styling for metric displays across dashboards
- Duplicate code for formatting numbers and percentages
- Varying approaches to displaying trend indicators
- Inconsistent icon usage and positioning
- No standardized handling of comparison values

## Component Interface

```typescript
interface MetricCardProps {
  /** Title of the metric */
  title: string;
  
  /** Main value to display */
  value: string | number;
  
  /** Unit to display with the value (optional) */
  unit?: string;
  
  /** Icon to display */
  icon?: React.ReactNode;
  
  /** Color scheme for the icon background */
  iconColor?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  
  /** Trend percentage or text */
  trendValue?: string | number;
  
  /** Whether trend is positive (even if down) */
  trendPositive?: boolean;
  
  /** Subtitle or description text */
  subtitle?: string;
  
  /** Additional content to display below the metric */
  children?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Click handler for the entire card */
  onClick?: () => void;
}
```

## Features

1. **Theme Awareness**: Automatically adapts to light or dark theme
2. **Trend Visualization**: Visual indicators for upward/downward trends
3. **Icon Support**: Colored icon backgrounds for visual categorization
4. **Flexible Formatting**: Support for different value types and units
5. **Comparison Display**: Optional display of comparison metrics
6. **Interactive Option**: Optional click handler for drill-down functionality

## Usage Examples

### Basic Usage

```tsx
import { MetricCard } from '../components/ui/MetricCard';
import { Users } from 'lucide-react';

<MetricCard
  title="Total Users"
  value={3254}
  icon={<Users className="h-6 w-6" />}
  iconColor="blue"
/>
```

### With Trend Indicator

```tsx
<MetricCard
  title="Monthly Revenue"
  value="$48,350"
  icon={<DollarSign className="h-6 w-6" />}
  iconColor="green"
  trend="up"
  trendValue="12%"
  trendPositive={true}
  subtitle="Compared to last month"
/>
```

### Negative Trend

```tsx
<MetricCard
  title="Support Tickets"
  value={37}
  icon={<TicketIcon className="h-6 w-6" />}
  iconColor="red"
  trend="up"
  trendValue="8%"
  trendPositive={false}
  subtitle="Compared to last week"
/>
```

### With Custom Unit

```tsx
<MetricCard
  title="Average Response Time"
  value={2.4}
  unit="hours"
  icon={<Clock className="h-6 w-6" />}
  iconColor="yellow"
  trend="down"
  trendValue="15%"
  trendPositive={true}
  subtitle="Compared to last month"
/>
```

### With Additional Content

```tsx
<MetricCard
  title="Active Projects"
  value={28}
  icon={<Briefcase className="h-6 w-6" />}
  iconColor="purple"
>
  <div className="mt-2 pt-2 border-t">
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Completed:</span>
      <span className="font-medium">12</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">In Progress:</span>
      <span className="font-medium">10</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Not Started:</span>
      <span className="font-medium">6</span>
    </div>
  </div>
</MetricCard>
```

### Interactive Metric

```tsx
<MetricCard
  title="Sales This Month"
  value="$36,420"
  icon={<ChartBar className="h-6 w-6" />}
  iconColor="blue"
  trend="up"
  trendValue="5%"
  trendPositive={true}
  subtitle="Compared to last month"
  onClick={() => navigate('/sales/details')}
/>
```

### Dashboard Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard
    title="Total Users"
    value={3254}
    icon={<Users className="h-6 w-6" />}
    iconColor="blue"
    trend="up"
    trendValue="12%"
    trendPositive={true}
  />
  
  <MetricCard
    title="Active Projects"
    value={28}
    icon={<Briefcase className="h-6 w-6" />}
    iconColor="purple"
  />
  
  <MetricCard
    title="Revenue"
    value="$48,350"
    icon={<DollarSign className="h-6 w-6" />}
    iconColor="green"
    trend="up"
    trendValue="8%"
    trendPositive={true}
  />
  
  <MetricCard
    title="Support Tickets"
    value={14}
    icon={<TicketIcon className="h-6 w-6" />}
    iconColor="yellow"
    trend="down"
    trendValue="23%"
    trendPositive={true}
  />
</div>
```

## Best Practices

1. **Use consistent icon colors** across related metrics
2. **Set trendPositive based on context**, not just direction (e.g., a decrease in errors is positive)
3. **Use appropriate units** for clarity
4. **Keep titles short** (1-3 words typically)
5. **Use grid layouts** for organizing multiple metrics
6. **Consider mobile layouts** - metrics should stack nicely on small screens

## Migration Guide

To migrate from custom metric implementations to the standardized component:

1. Import the MetricCard component
2. Replace custom metric displays with the MetricCard component
3. Select appropriate icon and color for the metric type
4. Add trend data if available

### Before:

```tsx
<div className="bg-white rounded-lg shadow p-4">
  <div className="flex items-center">
    <div className="bg-blue-100 p-3 rounded-full">
      <Users className="h-6 w-6 text-blue-600" />
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
      <p className="text-2xl font-semibold">3,254</p>
    </div>
  </div>
  <div className="mt-2 flex items-center">
    <ArrowUp className="h-4 w-4 text-green-500" />
    <span className="text-xs text-green-500 ml-1">12% increase</span>
    <span className="text-xs text-gray-400 ml-2">vs last month</span>
  </div>
</div>
```

### After:

```tsx
import { MetricCard } from '../components/ui/MetricCard';
import { Users } from 'lucide-react';

<MetricCard
  title="Total Users"
  value={3254}
  icon={<Users className="h-6 w-6" />}
  iconColor="blue"
  trend="up"
  trendValue="12%"
  trendPositive={true}
  subtitle="Compared to last month"
/>
```
