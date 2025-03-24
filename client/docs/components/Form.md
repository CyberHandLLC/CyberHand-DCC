# Form Components & Validation

## Overview

The Form components and validation hooks provide a standardized approach to form handling across the application. This system includes:

1. `Form` component - A container for form elements with standardized layouts
2. `FormItem` component - A wrapper for individual form fields with consistent styling
3. `FormErrorSummary` component - Displays validation errors in a standardized format
4. `FormSubmit` component - A submit button with built-in loading state handling
5. `useFormValidation` hook - Manages form state, validation, and submission

## Why Standardization Was Needed

Prior to these standardized components, the application had:

- Inconsistent form layouts and styling
- Duplicate validation logic across components
- Inconsistent error display patterns
- No standardized loading state handling during form submission
- Varying approaches to field validation

## Component Interfaces

### Form Component

```typescript
interface FormProps {
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Optional success message to display */
  successMessage?: string;
  
  /** Children components */
  children: React.ReactNode;
}
```

### FormItem Component

```typescript
interface FormItemProps {
  /** Field label */
  label: string;
  
  /** Error message (if any) */
  error?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Help text to display */
  helpText?: string;
  
  /** Children components (usually input elements) */
  children: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
}
```

### FormErrorSummary Component

```typescript
interface FormErrorSummaryProps {
  /** Object containing field errors */
  errors: Record<string, string>;
  
  /** Additional CSS classes */
  className?: string;
}
```

### FormSubmit Component

```typescript
interface FormSubmitProps {
  /** Whether form is submitting */
  isLoading?: boolean;
  
  /** Text to display while loading */
  loadingText?: string;
  
  /** Children (button text) */
  children: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether button is disabled */
  disabled?: boolean;
}
```

## useFormValidation Hook Interface

```typescript
interface UseFormValidationOptions<T> {
  /** Initial form values */
  initialValues: T;
  
  /** Validation schema */
  validationSchema: ValidationSchema<T>;
  
  /** Form submission handler */
  onSubmit: (values: T) => Promise<void> | void;
}

interface ValidationRule {
  /** Whether field is required */
  required?: string | boolean;
  
  /** Minimum length requirement */
  minLength?: { value: number; message: string };
  
  /** Maximum length requirement */
  maxLength?: { value: number; message: string };
  
  /** Pattern (regex) requirement */
  pattern?: { value: RegExp; message: string };
  
  /** Custom validation function */
  validate?: (value: any, formValues: any) => string | boolean;
  
  /** Fields that this field depends on */
  deps?: string[];
}

// Hook return type
interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  generalError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  resetForm: () => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
}
```

## Usage Examples

### Basic Form

```tsx
import { Form, FormItem, FormSubmit } from '../components/ui/Form';
import { useFormValidation } from '../hooks/useFormValidation';

function LoginForm() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
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
      // Handle form submission
      await loginUser(values);
    }
  });

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <FormItem 
        label="Email" 
        error={touched.email && errors.email}
        required
      >
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-gray-300 py-2 px-3"
        />
      </FormItem>
      
      <FormItem 
        label="Password" 
        error={touched.password && errors.password}
        required
      >
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-md border border-gray-300 py-2 px-3"
        />
      </FormItem>
      
      <FormSubmit isLoading={isSubmitting}>
        Login
      </FormSubmit>
    </Form>
  );
}
```

### Complex Validation

```tsx
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit
} = useFormValidation({
  initialValues: {
    password: '',
    confirmPassword: ''
  },
  validationSchema: {
    password: {
      required: 'Password is required',
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters'
      },
      validate: (value) => {
        // Custom validation logic
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        
        if (!hasUppercase || !hasLowercase || !hasNumber) {
          return 'Password must include uppercase, lowercase, and number';
        }
        
        return true;
      }
    },
    confirmPassword: {
      required: 'Please confirm your password',
      validate: (value, formValues) => {
        if (value !== formValues.password) {
          return 'Passwords do not match';
        }
        return true;
      },
      deps: ['password'] // This field depends on password
    }
  },
  onSubmit: async (values) => {
    // Handle submission
  }
});
```

### Form with Success Message

```tsx
<Form 
  onSubmit={handleSubmit} 
  successMessage={formSubmitted ? "Your information has been saved!" : undefined}
>
  {/* Form fields */}
</Form>
```

### Form with Error Summary

```tsx
<Form onSubmit={handleSubmit}>
  <FormErrorSummary errors={errors} />
  
  {/* Form fields */}
</Form>
```

## Best Practices

1. **Always use FormItem** for wrapping form fields
2. **Always display validation errors** next to the relevant fields
3. **Use FormErrorSummary** for a consolidated view of errors
4. **Use FormSubmit** for submit buttons to handle loading states
5. **Define validation schemas** outside the component for reusability
6. **Use dep arrays** for fields that depend on other fields
7. **Handle async validation** in the onSubmit function

## Migration Guide

To migrate from custom form handling to the standardized components:

1. Import the Form components and useFormValidation hook
2. Define your validation schema
3. Replace custom form state with the hook's return values
4. Wrap your form with the Form component
5. Wrap each field with FormItem
6. Replace the submit button with FormSubmit

### Before:

```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

const validateForm = () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Email is required';
  if (!password) newErrors.password = 'Password is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    setIsSubmitting(true);
    try {
      await loginUser({ email, password });
    } catch (err) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  }
};

return (
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <div className="text-red-500">{errors.email}</div>}
    </div>
    
    <div className="mb-4">
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <div className="text-red-500">{errors.password}</div>}
    </div>
    
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Logging in...' : 'Login'}
    </button>
  </form>
);
```

### After:

```tsx
const {
  values,
  errors,
  touched,
  isSubmitting,
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
      required: 'Email is required'
    },
    password: {
      required: 'Password is required'
    }
  },
  onSubmit: async (values) => {
    await loginUser(values);
  }
});

return (
  <Form onSubmit={handleSubmit}>
    <FormItem 
      label="Email" 
      error={touched.email && errors.email}
      required
    >
      <input
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full rounded-md border border-gray-300 py-2 px-3"
      />
    </FormItem>
    
    <FormItem 
      label="Password" 
      error={touched.password && errors.password}
      required
    >
      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full rounded-md border border-gray-300 py-2 px-3"
      />
    </FormItem>
    
    <FormSubmit isLoading={isSubmitting}>
      Login
    </FormSubmit>
  </Form>
);
```
