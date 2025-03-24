# FormInput Component

## Overview

The `FormInput` component provides a standardized input field with consistent styling, icon support, and error handling. It's designed to work with the Form component system while providing additional features and consistent theming.

## Why Standardization Was Needed

Prior to the standardized `FormInput` component, the application had:

- Inconsistent styling of input fields across components
- Duplicate code for handling input icons and error states
- Varying approaches to accessibility attributes
- Inconsistent width options and padding
- No standardized approach to help text

## Component Interface

```typescript
interface FormInputProps {
  /** Input name attribute */
  name: string;
  
  /** Input label */
  label: string;
  
  /** Input value */
  value: string | number;
  
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /** Blur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  
  /** Input type (text, email, password, etc.) */
  type?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Help text to display below the input */
  helpText?: string;
  
  /** Icon to display inside the input (left side) */
  icon?: React.ReactNode;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the input is disabled */
  disabled?: boolean;
  
  /** Input placeholder text */
  placeholder?: string;
  
  /** Input width variant */
  width?: 'full' | 'medium' | 'small';
  
  /** Additional CSS classes */
  className?: string;
}
```

## Features

1. **Theme Awareness**: Automatically adapts to light or dark theme
2. **Icon Support**: Optional icon displayed on the left side of the input
3. **Error Display**: Built-in error message display
4. **Help Text**: Optional helper text below the input
5. **Width Variants**: Preset width options for consistent layouts
6. **Accessibility**: Proper labeling and ARIA attributes

## Usage Examples

### Basic Usage

```tsx
import { FormInput } from '../components/ui/FormInput';

// In your component
function ProfileForm() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length < 2) {
      setNameError('Name must be at least 2 characters');
    } else {
      setNameError('');
    }
  };
  
  return (
    <form>
      <FormInput 
        name="name"
        label="Full Name"
        value={name}
        onChange={handleNameChange}
        error={nameError}
        required
      />
      
      {/* More form fields */}
      
      <button type="submit">Save Profile</button>
    </form>
  );
}
```

### With Icon and Help Text

```tsx
import { FormInput } from '../components/ui/FormInput';
import { Mail } from 'lucide-react';

<FormInput 
  name="email"
  label="Email Address"
  value={email}
  onChange={handleEmailChange}
  type="email"
  icon={<Mail className="h-5 w-5" />}
  helpText="We'll never share your email with anyone else."
  required
/>
```

### Different Width Variants

```tsx
// Full width (default)
<FormInput 
  name="address"
  label="Address"
  value={address}
  onChange={handleAddressChange}
  width="full"
/>

// Medium width
<FormInput 
  name="city"
  label="City"
  value={city}
  onChange={handleCityChange}
  width="medium"
/>

// Small width
<FormInput 
  name="zipCode"
  label="Zip Code"
  value={zipCode}
  onChange={handleZipChange}
  width="small"
/>
```

### Disabled State

```tsx
<FormInput 
  name="username"
  label="Username"
  value={username}
  onChange={handleUsernameChange}
  disabled={isSubmitting}
  helpText="Username cannot be changed after account creation."
/>
```

## Integration with useFormValidation

The FormInput component works seamlessly with the useFormValidation hook:

```tsx
import { useFormValidation } from '../hooks/useFormValidation';
import { FormInput } from '../components/ui/FormInput';
import { Mail, Lock } from 'lucide-react';

function LoginForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: {
      email: {
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      },
      password: {
        required: 'Password is required'
      }
    },
    onSubmit: async (values) => {
      // Login logic
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormInput 
        name="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        icon={<Mail className="h-5 w-5" />}
        required
      />
      
      <FormInput 
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password}
        icon={<Lock className="h-5 w-5" />}
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

## Best Practices

1. **Always use FormInput** for form input fields
2. **Provide clear, concise labels** for all inputs
3. **Use appropriate input types** (email, password, number, etc.)
4. **Show validation errors** only after field interaction (use onBlur)
5. **Use consistent width variants** for fields in the same form
6. **Provide helpful context** with the helpText prop

## Migration Guide

To migrate from custom input implementations to the standardized component:

1. Import the FormInput component
2. Replace custom input elements with FormInput
3. Map your existing state and event handlers to the component props

### Before:

```tsx
<div className="mb-4">
  <label 
    htmlFor="email" 
    className="block text-sm font-medium text-gray-700"
  >
    Email Address
  </label>
  
  <div className="mt-1 relative rounded-md shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Mail className="h-5 w-5 text-gray-400" />
    </div>
    
    <input
      type="email"
      id="email"
      name="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
      placeholder="you@example.com"
    />
  </div>
  
  {emailError && (
    <p className="mt-2 text-sm text-red-600">
      {emailError}
    </p>
  )}
</div>
```

### After:

```tsx
import { FormInput } from '../components/ui/FormInput';
import { Mail } from 'lucide-react';

<FormInput 
  name="email"
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
  error={emailError}
  icon={<Mail className="h-5 w-5" />}
  placeholder="you@example.com"
/>
```
