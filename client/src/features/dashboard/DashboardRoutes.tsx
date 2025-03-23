import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Dashboard from './Dashboard';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ServicesView from './components/client/ServicesView';
import ServiceDetailView from './components/client/ServiceDetailView';
import ClientOverview from './components/client/pages/Overview';
import ClientProjects from './components/client/pages/Projects';
import ClientDocuments from './components/client/pages/Documents';
import ClientSupportTickets from './components/client/pages/SupportTickets';
import ObserverOverview from './components/observer/pages/Overview';

/**
 * DashboardRoutes handles routing for all dashboard-related pages
 * It sets up proper role-based access control for each route
 */
const DashboardRoutes: React.FC = () => {
  const { user } = useAuth();
  
  // Helper to check if user has a specific role
  const hasRole = (role: string): boolean => {
    return user?.role?.toLowerCase() === role.toLowerCase();
  };
  
  // Default theme is light
  const theme = 'light';
  
  return (
    <Routes>
      {/* Main dashboard route */}
      <Route index element={<Dashboard />} />
      
      {/* Admin routes */}
      <Route 
        path="admin/*" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="service-management" element={<div>Service Management</div>} />
              <Route path="service-management/:serviceId" element={<div>Service Details</div>} />
              <Route path="invoice-management" element={<div>Invoice Management</div>} />
              <Route path="invoice-management/:invoiceId" element={<div>Invoice Details</div>} />
              <Route path="user-management" element={<div>User Management</div>} />
              <Route path="user-management/:userId" element={<div>User Details</div>} />
              <Route path="reports" element={<div>Reports Dashboard</div>} />
              <Route path="content-management" element={<div>Content Management</div>} />
              <Route path="content-management/:clientId" element={<div>Client Content Management</div>} />
            </Routes>
          </ProtectedRoute>
        } 
      />
      
      {/* Staff routes */}
      <Route
        path="staff/*"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="client-management" element={<div>Client Management</div>} />
              <Route path="client-management/:clientId" element={<div>Client Details</div>} />
              <Route path="client-management/:clientId/overview" element={<div>Client Overview</div>} />
              <Route path="client-management/:clientId/analytics" element={<div>Client Analytics</div>} />
              <Route path="client-management/:clientId/reports" element={<div>Client Reports</div>} />
              <Route path="client-management/:clientId/notifications" element={<div>Client Notifications</div>} />
              <Route path="content-management" element={<div>Content Management</div>} />
              <Route path="content-management/:clientId" element={<div>Client Content</div>} />
              <Route path="client-communication/:clientId" element={<div>Client Communication</div>} />
              <Route path="support-tickets" element={<div>Support Tickets</div>} />
              <Route path="support-tickets/:ticketId" element={<div>Ticket Details</div>} />
            </Routes>
          </ProtectedRoute>
        }
      />
      
      {/* Client routes */}
      <Route
        path="client/*"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF', 'CLIENT']}>
            <Routes>
              <Route index element={<ClientOverview theme={theme} />} />
              <Route path="dashboard" element={<ClientOverview theme={theme} />} />
              <Route path="services" element={<ServicesView />} />
              <Route path="services/:serviceId" element={<ServiceDetailView />} />
              <Route path="projects" element={<ClientProjects theme={theme} />} />
              <Route path="projects/:projectId" element={<div>Project Details</div>} />
              <Route path="documents" element={<ClientDocuments theme={theme} />} />
              <Route path="invoices" element={<div>Invoices</div>} />
              <Route path="reports" element={<div>Reports</div>} />
              <Route path="support-tickets" element={<ClientSupportTickets theme={theme} />} />
              <Route path="support-tickets/:ticketId" element={<div>Ticket Details</div>} />
            </Routes>
          </ProtectedRoute>
        }
      />
      
      {/* Observer routes */}
      <Route
        path="observer/*"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF', 'CLIENT', 'OBSERVER']}>
            <Routes>
              <Route index element={<ObserverOverview theme={theme} />} />
              <Route path="dashboard" element={<ObserverOverview theme={theme} />} />
              <Route path="projects" element={<div>Projects</div>} />
              <Route path="projects/:projectId" element={<div>Project Details</div>} />
              <Route path="services" element={<div>Available Services</div>} />
              <Route path="profile-settings" element={<div>Profile Settings</div>} />
            </Routes>
          </ProtectedRoute>
        }
      />
      
      {/* Redirect unknown dashboard paths to main dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;
