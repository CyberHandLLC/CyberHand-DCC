import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

  // Role-specific content components
  const AdminContent = () => (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">Admin Controls</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Manage all users and permissions</li>
        <li>View system-wide analytics</li>
        <li>Configure platform settings</li>
        <li>Access audit logs and security monitoring</li>
      </ul>
      <button
        onClick={() => navigate('/admin/users')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        User Management
      </button>
    </div>
  );

  const StaffContent = () => (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold text-green-700 mb-2">Staff Tools</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Manage client accounts</li>
        <li>View assigned projects</li>
        <li>Process service requests</li>
        <li>Generate client reports</li>
      </ul>
      <button
        onClick={() => navigate('/staff/clients')}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        Client Management
      </button>
    </div>
  );

  const ClientContent = () => (
    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold text-purple-700 mb-2">Client Dashboard</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>View your active services</li>
        <li>Submit new service requests</li>
        <li>Check project status updates</li>
        <li>Manage billing and invoices</li>
      </ul>
      <button
        onClick={() => navigate('/client/services')}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        My Services
      </button>
    </div>
  );

  const ObserverContent = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold text-yellow-700 mb-2">Observer View</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>View available services</li>
        <li>Browse case studies and resources</li>
        <li>Access public reports and information</li>
        <li>Limited read-only access</li>
      </ul>
      <button
        onClick={() => navigate('/services')}
        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
      >
        Browse Services
      </button>
    </div>
  );

  // Render content based on user role
  const renderRoleContent = () => {
    switch (user.role) {
      case 'ADMIN':
        return <AdminContent />;
      case 'STAFF':
        return <StaffContent />;
      case 'CLIENT':
        return <ClientContent />;
      case 'OBSERVER':
        return <ObserverContent />;
      default:
        return (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded">
            <p>Welcome to the dashboard. Your role-specific content is not available.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.firstName}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Role:</span> {user.role}
            </p>
            {user.status && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Status:</span> {user.status}
              </p>
            )}
          </div>
          <div>
            {user.emailVerified !== undefined && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Email Verified:</span>{' '}
                {user.emailVerified ? 'Yes' : 'No'}
              </p>
            )}
            {user.createdAt && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Member Since:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role-specific content */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          {renderRoleContent()}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500 py-8">
              <p>No recent activity to display</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                <span>Update Profile</span>
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                <span>Change Password</span>
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                <span>Notification Settings</span>
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
