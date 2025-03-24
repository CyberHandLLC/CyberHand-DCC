import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear context error when form is modified
  const handleFormChange = () => {
    if (error) {
      clearError();
    }
    if (formError) {
      setFormError(null);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    if (!password) {
      setFormError('Password is required');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login({ email, password });
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      console.error('Login error:', err);
      // The error is already set in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to CyberHand</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* API Error display */}
        {error && (
          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
            className="mb-4"
          />
        )}
        
        {/* Form validation error */}
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleFormChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Password field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleFormChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Submit button */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        {/* Forgot password link */}
        <div className="text-center mb-4">
          <Link 
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </Link>
        </div>
        
        {/* Registration link */}
        <div className="text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 hover:text-blue-800"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
