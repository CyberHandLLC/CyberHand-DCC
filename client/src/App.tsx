import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import ErrorNotifications from './components/ErrorNotifications';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/auth/Dashboard';
import Unauthorized from './components/auth/Unauthorized';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            {/* Global error notifications - will appear for any error in the app */}
            <ErrorNotifications />
            
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes */}
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
