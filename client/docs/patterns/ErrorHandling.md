# Error Handling Pattern

## Overview

The standardized error handling pattern provides a consistent approach to managing and displaying API errors across the application. This pattern consists of:

1. `useApiError` hook - Manages API error state and operations
2. `ErrorDisplay` component - Renders errors in a standardized format

## Why Standardization Was Needed

Prior to this standardized pattern, the application had:

- Inconsistent error handling across components
- Varying approaches to error display
- Duplicate error management code
- Insufficient context for users to understand errors
- No standardized retry functionality

## useApiError Hook Interface

```typescript
interface UseApiErrorReturn {
  /** Current error state */
  error: ApiError | null;
  
  /** Whether an API call is currently in progress */
  isLoading: boolean;
  
  /** Wrap an API call with error handling */
  handleApiCall: <T>(
    apiCall: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: ApiError) => void;
      context?: string;
    }
  ) => Promise<T | null>;
  
  /** Clear the current error */
  clearError: () => void;
  
  /** Set an error manually */
  setError: (error: ApiError) => void;
}

interface ApiError {
  message: string;
  status?: number;
  context?: string;
  details?: Record<string, any>;
}
```

## ErrorDisplay Component Interface

```typescript
interface ErrorDisplayProps {
  /** Error object to display */
  error: ApiError;
  
  /** Function to dismiss/clear the error */
  onDismiss?: () => void;
  
  /** Function to retry the operation */
  onRetry?: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Title to display (defaults to "Error") */
  title?: string;
}
```

## Usage Examples

### Basic API Call with Error Handling

```tsx
import { useApiError } from '../hooks/useApiError';
import ErrorDisplay from '../components/ui/ErrorDisplay';

function UserProfile() {
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  const [user, setUser] = useState(null);
  
  const fetchUser = useCallback(async () => {
    await handleApiCall(
      () => userAPI.getUser(userId),
      {
        onSuccess: (data) => setUser(data),
        context: 'Loading user profile'
      }
    );
  }, [userId, handleApiCall]);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return (
    <div className="p-4">
      {error && (
        <ErrorDisplay 
          error={error}
          onDismiss={clearError}
          onRetry={fetchUser}
        />
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : user ? (
        <UserProfileDetails user={user} />
      ) : null}
    </div>
  );
}
```

### Form Submission with Error Handling

```tsx
const { error, isLoading, handleApiCall, clearError } = useApiError();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  await handleApiCall(
    () => userAPI.updateProfile({
      name,
      email,
      bio
    }),
    {
      onSuccess: () => {
        setSuccessMessage('Profile updated successfully');
      },
      context: 'Updating user profile'
    }
  );
};

return (
  <form onSubmit={handleSubmit}>
    {error && (
      <ErrorDisplay 
        error={error}
        onDismiss={clearError}
      />
    )}
    
    {/* Form fields */}
    
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Saving...' : 'Save Changes'}
    </button>
  </form>
);
```

### Multiple API Calls with Distinct Error Handling

```tsx
function Dashboard() {
  // Create separate instances for different API operations
  const userErrorHandler = useApiError();
  const projectsErrorHandler = useApiError();
  const tasksErrorHandler = useApiError();
  
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Load user data
  const fetchUser = useCallback(async () => {
    await userErrorHandler.handleApiCall(
      () => userAPI.getCurrentUser(),
      {
        onSuccess: (data) => setUser(data),
        context: 'Loading user data'
      }
    );
  }, [userErrorHandler]);
  
  // Load projects
  const fetchProjects = useCallback(async () => {
    await projectsErrorHandler.handleApiCall(
      () => projectAPI.getUserProjects(),
      {
        onSuccess: (data) => setProjects(data),
        context: 'Loading projects'
      }
    );
  }, [projectsErrorHandler]);
  
  // Load tasks
  const fetchTasks = useCallback(async () => {
    await tasksErrorHandler.handleApiCall(
      () => taskAPI.getUserTasks(),
      {
        context: 'Loading tasks'
      }
    );
  }, [tasksErrorHandler]);
  
  useEffect(() => {
    fetchUser();
    fetchProjects();
    fetchTasks();
  }, [fetchUser, fetchProjects, fetchTasks]);
  
  return (
    <div className="space-y-6">
      {userErrorHandler.error && (
        <ErrorDisplay 
          error={userErrorHandler.error}
          onDismiss={userErrorHandler.clearError}
          onRetry={fetchUser}
        />
      )}
      
      {projectsErrorHandler.error && (
        <ErrorDisplay 
          error={projectsErrorHandler.error}
          onDismiss={projectsErrorHandler.clearError}
          onRetry={fetchProjects}
        />
      )}
      
      {tasksErrorHandler.error && (
        <ErrorDisplay 
          error={tasksErrorHandler.error}
          onDismiss={tasksErrorHandler.clearError}
          onRetry={fetchTasks}
        />
      )}
      
      {/* Dashboard content */}
    </div>
  );
}
```

## Advanced Features of useApiError

### Error Classification

The `useApiError` hook automatically classifies errors based on status codes:

```typescript
// Inside useApiError implementation
const classifyError = (error: any): ApiError => {
  // Network errors
  if (error.message === 'Network Error') {
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      status: 0,
      context: options?.context || 'API Call',
      type: 'network'
    };
  }
  
  // Server errors (500+)
  if (error.response?.status >= 500) {
    return {
      message: 'The server encountered an error. Our team has been notified.',
      status: error.response.status,
      context: options?.context || 'API Call',
      type: 'server',
      details: error.response.data
    };
  }
  
  // Client errors (400-499)
  if (error.response?.status >= 400) {
    let message = 'There was an error with your request.';
    
    // Handle specific status codes
    if (error.response.status === 401) {
      message = 'Your session has expired. Please log in again.';
    } else if (error.response.status === 403) {
      message = 'You don\'t have permission to perform this action.';
    } else if (error.response.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.response.status === 422) {
      message = 'Validation error. Please check your input.';
    }
    
    return {
      message,
      status: error.response.status,
      context: options?.context || 'API Call',
      type: 'client',
      details: error.response.data
    };
  }
  
  // Default error
  return {
    message: error.message || 'An unexpected error occurred',
    context: options?.context || 'API Call',
    type: 'unknown'
  };
};
```

### Error Persistence

Errors can be persisted across component remounts for critical operations:

```tsx
// Using sessionStorage to persist critical errors
const { error, clearError, setError } = useApiError({
  persistKey: 'payment-error' // Optional key for persistent errors
});

// Errors stored with this key will be loaded when the component mounts
// and cleared when clearError is called
```

## ErrorDisplay Component Features

### Visual Design

The `ErrorDisplay` component uses consistent styling based on error type:

- **Network errors**: Blue color scheme
- **Server errors**: Red color scheme
- **Validation errors**: Yellow color scheme
- **Authentication errors**: Purple color scheme

### Interactive Elements

The component provides interactive elements based on the error type:

- **Retry button**: For network and server errors
- **Dismiss button**: For all error types
- **Details toggle**: For validation and server errors with details
- **Login redirect**: For authentication errors

### Accessibility

The component includes proper accessibility features:

- ARIA roles and attributes
- Keyboard navigation
- Focus management when errors appear
- Screen reader friendly error messages

## Best Practices for Error Handling

1. **Always provide context**: When calling APIs, include a descriptive context string
   ```tsx
   handleApiCall(
     () => api.updateUser(user),
     { context: 'Updating user profile' }
   );
   ```

2. **Handle specific error cases**: Customize error handling for different scenarios
   ```tsx
   handleApiCall(
     () => api.deleteAccount(),
     {
       onError: (error) => {
         if (error.status === 409) {
           // Handle conflict scenario
           setConflictModalOpen(true);
         }
       },
       context: 'Deleting account'
     }
   );
   ```

3. **Group related API calls**: Use a single error handler for related operations
   ```tsx
   // Bad: Separate handlers for related operations
   const profileErrorHandler = useApiError();
   const preferencesErrorHandler = useApiError();
   
   // Good: Single handler for related operations
   const userSettingsErrorHandler = useApiError();
   ```

4. **Clear errors on component unmount**: Prevent stale errors when navigating
   ```tsx
   useEffect(() => {
     return () => {
       clearError();
     };
   }, [clearError]);
   ```

5. **Provide retry functionality**: Always include retry for critical operations
   ```tsx
   <ErrorDisplay 
     error={error}
     onDismiss={clearError}
     onRetry={fetchCriticalData}
   />
   ```

6. **Handle validation errors specially**: For form validation errors, map them to fields
   ```tsx
   handleApiCall(
     () => api.createUser(formData),
     {
       onError: (error) => {
         if (error.status === 422 && error.details?.fields) {
           // Map API validation errors to form fields
           setFieldErrors(error.details.fields);
         }
       },
       context: 'Creating user account'
     }
   );
   ```

## Implementation Example: Pagination with Error Handling

```tsx
function DataTable() {
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchData = useCallback(async () => {
    await handleApiCall(
      () => api.getItems({ page, pageSize: 10 }),
      {
        onSuccess: (result) => {
          setData(result.items);
          setTotalPages(result.totalPages);
        },
        context: `Loading page ${page} of items`
      }
    );
  }, [page, handleApiCall]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <div>
      {error && (
        <ErrorDisplay 
          error={error}
          onDismiss={clearError}
          onRetry={fetchData}
        />
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <table className="w-full">
            {/* Table content */}
          </table>
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || isLoading}
            >
              Previous
            </button>
            
            <span>
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={page === totalPages || isLoading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

## Migration Guide

To migrate from custom error handling to the standardized pattern:

### Before:

```tsx
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await api.getData();
    setData(response);
  } catch (err) {
    setError({
      message: err.message || 'An error occurred',
      status: err.response?.status
    });
    console.error('Error fetching data:', err);
  } finally {
    setIsLoading(false);
  }
};

return (
  <div>
    {error && (
      <div className="bg-red-50 p-4 rounded border border-red-300 mb-4">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700">{error.message}</p>
        <button 
          onClick={() => setError(null)}
          className="text-red-700 underline mt-2"
        >
          Dismiss
        </button>
        <button 
          onClick={fetchData}
          className="ml-4 text-red-700 underline mt-2"
        >
          Retry
        </button>
      </div>
    )}
    
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      // Render data
    )}
  </div>
);
```

### After:

```tsx
import { useApiError } from '../hooks/useApiError';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';

const { error, isLoading, handleApiCall, clearError } = useApiError();

const fetchData = async () => {
  await handleApiCall(
    () => api.getData(),
    {
      onSuccess: (response) => {
        setData(response);
      },
      context: 'Fetching data'
    }
  );
};

useEffect(() => {
  fetchData();
}, []);

return (
  <div>
    {error && (
      <ErrorDisplay 
        error={error}
        onDismiss={clearError}
        onRetry={fetchData}
      />
    )}
    
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      // Render data
    )}
  </div>
);
```

## Conclusion

The standardized error handling pattern provides a consistent, maintainable approach to handling API errors across the application. By centralizing error logic in the `useApiError` hook and standardizing error display with the `ErrorDisplay` component, we ensure a cohesive user experience and reduce code duplication.

Implementing this pattern helps developers:

1. Focus on business logic rather than error handling boilerplate
2. Provide better feedback to users during errors
3. Maintain consistency in the user experience
4. Handle complex error scenarios with minimal code
5. Include retry functionality with minimal effort
