import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, BarChart, FileText, AlertTriangle, Download } from 'lucide-react';

// Mock service data
const services = {
  '1': { 
    id: 1, 
    name: "Website Maintenance", 
    description: "Monthly maintenance of your website including security updates, content updates, and performance optimization.",
    status: "active", 
    nextBilling: "2025-04-15", 
    startDate: "2024-10-15",
    amount: 299,
    features: [
      "Weekly backups",
      "Security monitoring",
      "Content updates (up to 4 hrs/month)",
      "Performance optimization",
      "Monthly reports"
    ],
    usageMetrics: [
      { name: "Content Updates Used", value: "2.5 hrs", total: "4 hrs", percentage: 62 },
      { name: "Backups Created", value: "3", total: "4", percentage: 75 },
      { name: "Support Hours", value: "0.5 hrs", total: "2 hrs", percentage: 25 }
    ],
    activityHistory: [
      { date: "2025-03-20", activity: "Monthly report delivered", type: "report" },
      { date: "2025-03-15", activity: "Content update: Homepage hero section", type: "content" },
      { date: "2025-03-10", activity: "Security patches applied", type: "maintenance" },
      { date: "2025-03-05", activity: "Weekly backup completed", type: "backup" },
      { date: "2025-03-01", activity: "Performance optimization", type: "maintenance" }
    ]
  },
  '2': { 
    id: 2, 
    name: "Social Media Management", 
    description: "Managing your social media accounts with regular posts, engagement, and analytics reports.",
    status: "active", 
    nextBilling: "2025-04-10", 
    startDate: "2024-11-10",
    amount: 199,
    features: [
      "3 posts per week",
      "Community engagement",
      "Performance analytics",
      "Content calendar",
      "Monthly strategy updates"
    ],
    usageMetrics: [
      { name: "Posts Created", value: "10", total: "12", percentage: 83 },
      { name: "Engagement Actions", value: "45", total: "50", percentage: 90 },
      { name: "Content Planning", value: "1.5 hrs", total: "2 hrs", percentage: 75 }
    ],
    activityHistory: [
      { date: "2025-03-22", activity: "Instagram post published", type: "content" },
      { date: "2025-03-19", activity: "Facebook post engagement report", type: "report" },
      { date: "2025-03-17", activity: "Twitter campaign launched", type: "content" },
      { date: "2025-03-15", activity: "Weekly analytics review", type: "report" },
      { date: "2025-03-12", activity: "Content calendar updated", type: "planning" }
    ]
  }
};

interface ServiceDetailViewProps {
  theme?: 'light' | 'dark';
}

const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ theme = 'dark' }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'history'>('overview');
  
  // Get service details
  const service = serviceId ? services[serviceId as keyof typeof services] : null;
  
  // If service not found
  if (!service) {
    return (
      <div className={`p-8 text-center ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg`}>
        <AlertTriangle className={`h-12 w-12 mx-auto mb-4 ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`} />
        <h2 className={`text-xl font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Service Not Found
        </h2>
        <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          The requested service could not be found.
        </p>
        <button
          onClick={() => navigate('/dashboard/client/services')}
          className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          Return to Services
        </button>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      case "pending":
        return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 bg-opacity-40 text-yellow-300';
      case "inactive":
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 bg-opacity-40 text-red-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };
  
  // Get activity type icon
  const getActivityIcon = (type: string) => {
    switch(type) {
      case "report":
        return <FileText className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      case "maintenance":
        return <Check className="h-4 w-4" />;
      case "backup":
        return <Download className="h-4 w-4" />;
      case "planning":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };
  
  // Get activity type color
  const getActivityColor = (type: string) => {
    switch(type) {
      case "report":
        return theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900 bg-opacity-30 text-purple-400';
      case "content":
        return theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 bg-opacity-30 text-blue-400';
      case "maintenance":
        return theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900 bg-opacity-30 text-green-400';
      case "backup":
        return theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900 bg-opacity-30 text-indigo-400';
      case "planning":
        return theme === 'light' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-900 bg-opacity-30 text-yellow-400';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-900 bg-opacity-30 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center space-x-2">
        <Link 
          to="/dashboard/client/services" 
          className={`flex items-center ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'}`}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to services</span>
        </Link>
      </div>
      
      {/* Service Header */}
      <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-2xl font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {service.name}
            </h1>
            <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              {service.description}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </span>
        </div>
        
        {/* Service details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Monthly fee
            </p>
            <p className={`mt-1 text-xl font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {formatCurrency(service.amount)}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Next billing
            </p>
            <p className={`mt-1 text-xl font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {formatDate(service.nextBilling)}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Service started
            </p>
            <p className={`mt-1 text-xl font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {formatDate(service.startDate)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'overview'
                ? `${theme === 'light' ? 'border-teal-500 text-teal-600' : 'border-teal-400 text-teal-400'}`
                : `${theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'usage'
                ? `${theme === 'light' ? 'border-teal-500 text-teal-600' : 'border-teal-400 text-teal-400'}`
                : `${theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`
            }`}
            onClick={() => setActiveTab('usage')}
          >
            Usage & Metrics
          </button>
          <button
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'history'
                ? `${theme === 'light' ? 'border-teal-500 text-teal-600' : 'border-teal-400 text-teal-400'}`
                : `${theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'}`
            }`}
            onClick={() => setActiveTab('history')}
          >
            Activity History
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Features */}
            <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
              <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Service Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 ${theme === 'light' ? 'bg-green-100' : 'bg-green-900 bg-opacity-30'}`}>
                      <Check className={`h-4 w-4 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`} />
                    </div>
                    <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Actions */}
            <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
              <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Service Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  className={`flex items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#1e2a45] text-gray-300 hover:bg-[#283856]'}`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Request Content Update
                </button>
                <button 
                  className={`flex items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#1e2a45] text-gray-300 hover:bg-[#283856]'}`}
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  View Latest Report
                </button>
                <button 
                  className={`flex items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#1e2a45] text-gray-300 hover:bg-[#283856]'}`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report an Issue
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'usage' && (
          <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
            <h3 className={`text-lg font-medium mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Current Month Usage
            </h3>
            
            <div className="space-y-6">
              {service.usageMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {metric.name}
                    </span>
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {metric.value} / {metric.total}
                    </span>
                  </div>
                  <div className={`w-full h-2 ${theme === 'light' ? 'bg-gray-200' : 'bg-[#1e2a45]'} rounded-full`}>
                    <div 
                      className="h-2 rounded-full bg-teal-500" 
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h4 className={`text-base font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Need more resources?
              </h4>
              <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                If you're consistently using all your allocated resources, consider upgrading your service plan.
              </p>
              <button 
                className="px-4 py-2 rounded-md bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium"
              >
                Discuss upgrade options
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
            <h3 className={`text-lg font-medium mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Recent Activity
            </h3>
            
            <div className="relative">
              <div className="border-l-2 border-gray-600 ml-3 pt-2 pb-6">
                {service.activityHistory.map((activity, index) => (
                  <div key={index} className="relative mb-6 ml-10">
                    <div className="absolute -left-14 mt-1.5">
                      <div className={`p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div>
                      <p className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                        {activity.activity}
                      </p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button 
                className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}
              >
                View full activity history
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailView;
