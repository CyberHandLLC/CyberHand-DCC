# Icon Standardization

This documentation outlines the standardized icon usage patterns and guidelines for the application.

## Components

### Icon Component

The base `Icon` component provides a standardized way to display icons throughout the application.

```tsx
import Icon from '../components/ui/Icon';
import { Mail } from 'lucide-react';

// Basic usage
<Icon icon={Mail} />

// With size and variant
<Icon 
  icon={Mail} 
  size="lg" 
  variant="primary" 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | Required | The Lucide icon component to render |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'custom'` | `'md'` | Predefined size of the icon |
| `customSize` | `number` | `undefined` | Custom size in pixels (only used when size='custom') |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'muted'` | `'default'` | Color variant for the icon |
| `themeAware` | `boolean` | `true` | Whether to adapt color based on the current theme |
| `className` | `string` | `undefined` | Additional class names to apply |
| `label` | `string` | `undefined` | ARIA label for accessibility |

### IconText Component

The `IconText` component provides a standardized way to display icons with text.

```tsx
import IconText from '../components/ui/IconText';
import { Mail } from 'lucide-react';

// Basic usage
<IconText 
  icon={Mail} 
  text="Contact Us" 
/>

// Icon on the right
<IconText 
  icon={Mail} 
  text="Contact Us"
  iconPosition="right"
  textStyle="bold"
/>

// As a button
<IconText 
  icon={Mail} 
  text="Send Email"
  asButton
  onClick={() => console.log('Clicked')}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | Required | The Lucide icon to display |
| `text` | `ReactNode` | Required | Text content to display alongside the icon |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of the icon relative to the text |
| `spacing` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Space between the icon and text |
| `iconProps` | `Partial<Omit<IconProps, 'icon'>>` | `{}` | Props to pass to the Icon component |
| `textStyle` | `'normal' \| 'bold' \| 'heading' \| 'small' \| 'label'` | `'normal'` | Text size/weight styling |
| `alignCenter` | `boolean` | `true` | Apply vertical alignment adjustments |
| `className` | `string` | `undefined` | Additional class names to apply |
| `inline` | `boolean` | `false` | Whether the component should be displayed inline |
| `onClick` | `() => void` | `undefined` | Optional click handler |
| `asButton` | `boolean` | `false` | Whether the component should be rendered as a button |
| `disabled` | `boolean` | `false` | Disabled state when used as a button |

### IconButton Component

The `IconButton` component provides a standardized way to create buttons with icons.

```tsx
import IconButton from '../components/ui/IconButton';
import { Trash2 } from 'lucide-react';

// Basic usage
<IconButton 
  icon={Trash2} 
  label="Delete item"
/>

// Primary variant
<IconButton 
  icon={Trash2}
  variant="danger"
  size="lg"
  rounded="full"
  label="Delete item"
  onClick={handleDelete}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | Required | The Lucide icon to display |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size variant |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'outline' \| 'ghost'` | `'default'` | Button visual style variant |
| `iconProps` | `Partial<Omit<IconProps, 'icon'>>` | `{}` | Props to pass to the Icon component |
| `rounded` | `'normal' \| 'full'` | `'normal'` | Rounded style for the button |
| `className` | `string` | `undefined` | Additional class names to apply |
| `onClick` | `(e: React.MouseEvent<HTMLButtonElement>) => void` | `undefined` | Click handler |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `label` | `string` | Required | ARIA label for accessibility (required for icon-only buttons) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML type attribute |
| `tooltip` | `string` | `undefined` | Optional tooltip text to show on hover |

## Sizing Guidelines

### Standard Icon Sizes

| Size | Pixel Value | Use Case |
|------|-------------|----------|
| `xs` | 12px | Small indicators, tight UI spaces, badges |
| `sm` | 16px | Standard UI elements, form fields, menus |
| `md` | 20px | Primary UI controls, navigation items |
| `lg` | 24px | Feature highlights, primary actions |
| `xl` | 32px | Hero sections, empty states, feature cards |

### Sizing in Different Contexts

- **Inline Text**: Use `xs` or `sm` sizes for icons within text
- **Buttons**: Match icon size to button size - `sm` for small buttons, `md` for medium, etc.
- **Navigation**: Use consistent `md` size for all navigation icons
- **Feature Cards**: Use `lg` or `xl` for feature cards and marketing sections
- **Empty States**: Use `xl` for empty state illustrations
- **Form Fields**: Use `sm` size for form field icons (prefix/suffix)

## Icon + Text Patterns

### Standard Spacing

When combining icons with text, follow these spacing guidelines:

| Spacing | Use Case |
|---------|----------|
| `none` | Tight UI elements where space is limited |
| `xs` (0.25rem) | Compact elements like badges, tags |
| `sm` (0.5rem) | Standard spacing for most UI elements |
| `md` (0.75rem) | Buttons, menu items, list items |
| `lg` (1rem) | Feature cards, marketing elements |

### Icon Position

- **Left Position** (default): For most UI elements, icons should be positioned to the left of the text
- **Right Position**: For indicators of actions (e.g., "View Details →"), external links, or directional hints

## Implementation Examples

### Basic Icon

```tsx
import Icon from '../components/ui/Icon';
import { Mail } from 'lucide-react';

<Icon icon={Mail} size="md" variant="primary" />
```

### Icon with Text in a Button

```tsx
import IconText from '../components/ui/IconText';
import { Send } from 'lucide-react';

<button className="px-4 py-2 bg-blue-500 text-white rounded-md">
  <IconText 
    icon={Send} 
    text="Send Message" 
    iconProps={{ size: 'sm' }}
    textStyle="bold"
  />
</button>
```

### Icon Button for Actions

```tsx
import IconButton from '../components/ui/IconButton';
import { Edit } from 'lucide-react';

<IconButton 
  icon={Edit}
  variant="outline"
  size="sm"
  label="Edit item"
  onClick={handleEdit}
/>
```

### Menu Item with Icon

```tsx
import IconText from '../components/ui/IconText';
import { Settings } from 'lucide-react';

<div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
  <IconText 
    icon={Settings} 
    text="Settings" 
    spacing="md"
    iconProps={{ size: 'sm', variant: 'muted' }}
  />
</div>
```

## Accessibility Considerations

- Always provide `label` props for `IconButton` components
- Use `iconProps={{ label: 'Description' }}` for standalone icons that convey meaning
- Ensure sufficient color contrast for icons, especially when using color variants
- Consider adding tooltips to icon-only buttons for additional context

## Migration Guide

When updating existing code to use the standardized icon components:

1. Replace direct Lucide icon usage with the `Icon` component
2. Replace icon + text combinations with the `IconText` component
3. Replace icon-only buttons with the `IconButton` component
4. Ensure consistent sizing using the predefined sizes

### Before:

```tsx
import { Mail } from 'lucide-react';

<button className="flex items-center space-x-2">
  <Mail size={16} className="text-blue-500" />
  <span>Contact Us</span>
</button>
```

### After:

```tsx
import IconText from '../components/ui/IconText';
import { Mail } from 'lucide-react';

<IconText 
  icon={Mail} 
  text="Contact Us"
  iconProps={{ size: 'sm', variant: 'primary' }}
  asButton
  onClick={handleContact}
/>
```
