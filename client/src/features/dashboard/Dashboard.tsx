import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import ClientDashboard from './components/client/ClientDashboard';
import ObserverDashboard from './components/observer/ObserverDashboard';

/**
 * Main Dashboard component that renders the appropriate dashboard based on user role
 * This component maintains the same layout as the original Dashboard but delegates
 * role-specific content to specialized components
 */
const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    // Default to dark theme
    document.documentElement.classList.add('dark');
    
    return () => {
      // Cleanup when unmounting
      setInitialized(false);
    };
  }, []);

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
  
  // Determine which dashboard to render based on user role
  const userRole = user?.role ? user.role.toLowerCase() : 'unknown';
  
  // Log current path for debugging
  console.log('Current path:', location.pathname);
  console.log('User role:', userRole);
  
  // Render the appropriate dashboard based on user role
  switch(userRole) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'staff':
      return <StaffDashboard user={user} />;
    case 'client':
      return <ClientDashboard user={user} />;
    case 'observer':
      return <ObserverDashboard user={user} />;
    default:
      // If no role matches or unknown role, use the admin dashboard as fallback
      console.warn('Unknown user role:', userRole, 'Falling back to Admin dashboard');
      return <AdminDashboard user={user} />;
  }
};

export default Dashboard;
