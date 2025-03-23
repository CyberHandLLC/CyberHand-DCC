import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import ErrorNotifications from './components/ErrorNotifications';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import Unauthorized from './components/auth/Unauthorized';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// Import page components
import ExpandedServices from './pages/ExpandedServices';
import ExpandedAIIntegration from './pages/ExpandedAIIntegration';
import ExpandedCloudHosting from './pages/ExpandedCloudHosting';
import ExpandedMarketing from './pages/ExpandedMarketing';
import Blog from './pages/Blog';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            {/* Global error notifications - will appear for any error in the app */}
            <ErrorNotifications />
            
            <Routes>
              {/* Public routes within MainLayout */}
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/services" element={<ExpandedServices />} />
                <Route path="/ai-integration" element={<ExpandedAIIntegration />} />
                <Route path="/cloud-hosting" element={<ExpandedCloudHosting />} />
                <Route path="/marketing" element={<ExpandedMarketing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected routes within MainLayout */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin-only routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN']}>
                      <div>Admin Area (Placeholder)</div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Staff routes */}
                <Route 
                  path="/staff/*" 
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
                      <div>Staff Area (Placeholder)</div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Client routes */}
                <Route 
                  path="/client/*" 
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN', 'STAFF', 'CLIENT']}>
                      <div>Client Area (Placeholder)</div>
                    </ProtectedRoute>
                  } 
                />
              </Route>

              {/* Authentication routes (without MainLayout) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;
