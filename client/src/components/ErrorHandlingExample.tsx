import React, { useState } from 'react';
import { apiGet, apiPost } from '../api/apiClient';
import useErrorHandler from '../hooks/useErrorHandler';

/**
 * Example component demonstrating error handling usage
 */
const ErrorHandlingExample: React.FC = () => {
  const { tryCatch } = useErrorHandler();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Example of fetching data with built-in error handling
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Using our API client which has built-in error handling
      const response = await apiGet('/example-endpoint');
      
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      // The error is already handled by our apiClient interceptor
      // We don't need to do anything here
      console.log('Error handled by API client');
    } finally {
      setLoading(false);
    }
  };

  // Example using the tryCatch utility
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setLoading(true);
    
    // The tryCatch utility will handle any errors automatically
    const result = await tryCatch(
      async () => {
        const formData = new FormData(event.target as HTMLFormElement);
        const payload = Object.fromEntries(formData.entries());
        
        const response = await apiPost('/example-submit', payload);
        return response.data;
      },
      { formAction: 'submit', context: 'ErrorHandlingExample' } // Additional context for logs
    );
    
    if (result) {
      // Success path - handle the result
      setData(result);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Error Handling Example</h2>
      
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block mb-2">
            Name:
            <input
              className="border rounded px-2 py-1 w-full"
              type="text"
              name="name"
              required
            />
          </label>
        </div>
        
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Form'}
        </button>
      </form>
      
      {data && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Response Data:</h3>
          <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ErrorHandlingExample;
