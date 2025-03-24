import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User as UserType } from '../../types/user';
import { useTheme } from '../../context/ThemeContext';
import LoadingState from '../../components/ui/LoadingState';

// Import dashboard content components 
import ClientDashboardContent from './components/client/ClientDashboardContent';
import AdminDashboardContent from './components/admin/AdminDashboardContent';
import StaffDashboardContent from './components/staff/StaffDashboardContent';
import ObserverDashboardContent from './components/observer/ObserverDashboardContent';

/**
 * StandardDashboard component that uses the standardized DashboardLayout
 * This serves as a wrapper to maintain existing functionality while using the new layout system
 */
const StandardDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();

  // Apply theme class to document on initial load
  useEffect(() => {
    // Ensure theme is consistent with ThemeContext
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    return () => {
      // Cleanup is handled by ThemeContext
    };
  }, [theme]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Determine which dashboard content to render based on user role
  const userRole = user?.role?.toLowerCase() || 'client';
  
  // Ensure role is one of the allowed types in UserType
  const validateRole = (role: string): 'admin' | 'staff' | 'client' => {
    if (role === 'admin' || role === 'staff' || role === 'client') {
      return role as 'admin' | 'staff' | 'client';
    }
    // Default to client for any other role
    return 'client';
  };
  
  // Convert user data to UserType format for consistency
  const userTypeData: UserType = {
    id: typeof user?.id === 'string' ? parseInt(user.id, 10) : 0,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: validateRole(userRole),
    // Optional fields with defaults
    status: 'active',
    created: user?.createdAt ? new Date(user.createdAt) : new Date(),
  };

  // Log current path for debugging
  console.log('Current path:', location.pathname);
  console.log('User role:', userRole);

  // Render the appropriate dashboard based on user role
  switch(userRole) {
    case 'admin':
      return <AdminDashboardContent user={userTypeData} />;
    case 'staff':
      return <StaffDashboardContent user={userTypeData} />;
    case 'client':
      return <ClientDashboardContent user={userTypeData} />;
    case 'observer':
      return <ObserverDashboardContent user={userTypeData} />;
    default:
      // If no role matches or unknown role, use the client dashboard as fallback
      console.warn('Unknown user role:', userRole, 'Falling back to Client dashboard');
      return <ClientDashboardContent user={userTypeData} />;
  }
};

export default StandardDashboard;
