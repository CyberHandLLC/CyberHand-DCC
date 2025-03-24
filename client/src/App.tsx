import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorNotifications from './components/ErrorNotifications';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StandardDashboard from './features/dashboard/StandardDashboard';
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
        <ThemeProvider>
          <Router>
            <div className="min-h-screen">
              {/* Global error notifications - will appear for any error in the app */}
              <ErrorNotifications />
              
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <StandardDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Public Routes with MainLayout */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/services" element={<MainLayout><ExpandedServices /></MainLayout>} />
                <Route path="/ai-integration" element={<MainLayout><ExpandedAIIntegration /></MainLayout>} />
                <Route path="/cloud-hosting" element={<MainLayout><ExpandedCloudHosting /></MainLayout>} />
                <Route path="/marketing" element={<MainLayout><ExpandedMarketing /></MainLayout>} />
                <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
                <Route path="/resources" element={<MainLayout><Resources /></MainLayout>} />
                <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;
