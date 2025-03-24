import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, FileText, AlertTriangle, Download, Loader } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import useApiError from '../../../../hooks/useApiError';
import ErrorDisplay from '../../../../components/ui/ErrorDisplay';
import serviceAPI from '../../../../api/services/serviceAPI';
import { ClientService, BillingPeriod } from '../../../../types/service';

// Extended ClientService type to include UI-specific fields for the view
interface ExtendedClientService extends ClientService {
  usageMetrics?: Array<{
    name: string;
    value: string;
    total: string;
    percentage: number;
  }>;
  activityHistory?: Array<{
    date: string;
    activity: string;
    type: string;
  }>;
}

// Mock service data for fallback
const mockServices: Record<string, ExtendedClientService> = {
  '1': { 
    id: 1, 
    name: "Website Maintenance", 
    description: "Monthly maintenance of your website including security updates, content updates, and performance optimization.",
    status: "active" as const,
    nextBillingDate: "2025-04-15", 
    startDate: "2024-10-15",
    price: 299,
    category: "maintenance",
    billingPeriod: "monthly" as BillingPeriod,
    isRecurring: true,
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
    status: "active" as const, 
    nextBillingDate: "2025-04-10", 
    startDate: "2024-11-10",
    price: 199,
    category: "marketing",
    billingPeriod: "monthly" as BillingPeriod,
    isRecurring: true,
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'history'>('overview');
  const [service, setService] = useState<ExtendedClientService | null>(null);
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch service details when component mounts
  useEffect(() => {
    if (!serviceId || !user?.id) return;
    
    const fetchServiceDetails = async () => {
      const response = await handleApiCall(
        serviceAPI.getServiceById(parseInt(serviceId)),
        { context: `Fetching service details for ${serviceId}` }
      );
      
      if (response?.data) {
        // Need to type cast and ensure required ClientService properties are present
        const serviceData = response.data as any;
        
        // Create an ExtendedClientService by ensuring required properties exist
        const extendedService: ExtendedClientService = {
          ...serviceData,
          // Ensure required ClientService properties
          isRecurring: serviceData.isRecurring ?? serviceData.recurring ?? true,
          billingPeriod: serviceData.billingPeriod || 'monthly',
          category: serviceData.category || 'general',
          // Map any service.amount to price if needed
          price: serviceData.price || serviceData.amount || 0
        };
        
        setService(extendedService);
      } else {
        // Fall back to mock data if API fails
        setService(mockServices[serviceId as keyof typeof mockServices] || null);
      }
    };
    
    fetchServiceDetails();
  }, [serviceId, user?.id, handleApiCall]);
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Loading service details...
        </p>
      </div>
    );
  }
  
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
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
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
      
      {/* Error display */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={clearError}
          className="mb-4"
        />
      )}
      
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
              {formatCurrency(service.price)}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Next billing date
            </p>
            <p className={`mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {formatDate(service.nextBillingDate)}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Service started
            </p>
            <p className={`mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {formatDate(service.startDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className={`flex border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'overview'
              ? `${theme === 'light' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-blue-500 text-blue-400'}`
              : `${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'}`
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'usage'
              ? `${theme === 'light' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-blue-500 text-blue-400'}`
              : `${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'}`
          }`}
        >
          Usage
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'history'
              ? `${theme === 'light' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-blue-500 text-blue-400'}`
              : `${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'}`
          }`}
        >
          History
        </button>
      </div>
      
      {/* Tab content */}
      <div>
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
            <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Service Features
            </h3>
            
            <ul className="space-y-2">
              {service.features?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} />
                  <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6">
              <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Service Details
              </h3>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                <div>
                  <span className={`block text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Billing period
                  </span>
                  <span>
                    {service.billingPeriod.charAt(0).toUpperCase() + service.billingPeriod.slice(1)}
                  </span>
                </div>
                <div>
                  <span className={`block text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Recurring
                  </span>
                  <span>
                    {service.isRecurring ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className={`block text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Category
                  </span>
                  <span>
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Usage tab */}
        {activeTab === 'usage' && (
          <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
            <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Usage Metrics
            </h3>
            
            {service.usageMetrics ? (
              <div className="space-y-6">
                {service.usageMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {metric.name}
                      </span>
                      <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {metric.value} / {metric.total}
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                      <div 
                        className="bg-teal-600 h-2.5 rounded-full" 
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                No usage metrics available for this service.
              </p>
            )}
          </div>
        )}
        
        {/* History tab */}
        {activeTab === 'history' && (
          <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg p-6`}>
            <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Activity History
            </h3>
            
            {service.activityHistory ? (
              <div className="space-y-4">
                {service.activityHistory.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1a2944]'}`}
                  >
                    <div className={`p-2 rounded-full mr-3 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
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
            ) : (
              <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                No activity history available for this service.
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ServiceDetailView;
