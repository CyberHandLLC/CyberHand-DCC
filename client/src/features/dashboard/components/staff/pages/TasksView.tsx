import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, ArrowUp, ArrowDown, MoreHorizontal, 
  Clock, Loader, RefreshCw 
} from 'lucide-react';

// Import error handling components
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';
import useApiError from '../../../../../hooks/useApiError';
import taskAPI from '../../../../../api/services/taskAPI';
import ClientSelector from '../../../../../components/ui/ClientSelector';
import LoadingState from '../../../../../components/ui/LoadingState';
import EmptyState from '../../../../../components/ui/EmptyState';

// Import types
import { Task, TaskStatus, TaskPriority } from '../../../../../types/task';
import { Client, getClientDisplayName } from '../../../../../types/client';

// Import mock data for fallback
import { mockTasks } from '../../../../../mock/tasks';

interface TasksViewProps {
  theme: 'light' | 'dark';
}

const TasksView: React.FC<TasksViewProps> = ({ theme }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Task>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Error handling
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Task status tabs
  const statusTabs: Array<{ value: TaskStatus | 'all', label: string }> = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];
  
  // Fetch tasks based on filters
  const fetchTasks = useCallback(async () => {
    try {
      let response;
      
      if (selectedClient) {
        // Fetch tasks for selected client
        response = await handleApiCall(
          taskAPI.getTasksByClient(selectedClient.id.toString()),
          { context: `Fetching tasks for ${getClientDisplayName(selectedClient)}` }
        );
      } else if (statusFilter !== 'all') {
        // Fetch tasks by status
        response = await handleApiCall(
          taskAPI.getAllTasks({ status: statusFilter }),
          { context: `Fetching ${statusFilter} tasks` }
        );
      } else {
        // Fetch all tasks
        response = await handleApiCall(
          taskAPI.getAllTasks(),
          { context: 'Fetching all tasks' }
        );
      }
      
      if (response?.data) {
        setTasks(response.data);
        // Initial filtering will be handled by useEffect
      }
    } catch (err) {
      // Fall back to mock data
      setTasks(mockTasks);
    }
  }, [selectedClient, statusFilter, handleApiCall]);
  
  // Initial load
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient, statusFilter]);
  
  // Filter tasks based on search query and priority filter
  useEffect(() => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.client?.toLowerCase().includes(query)
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      // Handle string comparison
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      // Handle number/boolean comparison
      if (fieldA !== undefined && fieldB !== undefined) {
        return sortDirection === 'asc' 
          ? (fieldA > fieldB ? 1 : -1) 
          : (fieldA < fieldB ? 1 : -1);
      }
      
      return 0;
    });
    
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, priorityFilter, sortField, sortDirection]);
  
  // Toggle sort direction or change sort field
  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Update task status
  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await handleApiCall(
        taskAPI.updateTaskStatus(taskId, status),
        { context: `Updating task status to ${status}` }
      );
      
      if (response?.success) {
        // Refresh tasks after update
        fetchTasks();
      }
    } catch (err) {
      // Fall back to mock data
      setTasks(mockTasks);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Check if a task is overdue
  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    return taskDueDate < today;
  };
  
  // Renders priority badge with appropriate color
  const renderPriorityBadge = (priority: TaskPriority) => {
    let bgColorClass, textColorClass;
    
    if (theme === 'light') {
      switch (priority) {
        case 'high':
          bgColorClass = 'bg-red-100';
          textColorClass = 'text-red-800';
          break;
        case 'medium':
          bgColorClass = 'bg-orange-100';
          textColorClass = 'text-orange-800';
          break;
        case 'low':
          bgColorClass = 'bg-green-100';
          textColorClass = 'text-green-800';
          break;
      }
    } else {
      switch (priority) {
        case 'high':
          bgColorClass = 'bg-red-900 bg-opacity-30';
          textColorClass = 'text-red-400';
          break;
        case 'medium':
          bgColorClass = 'bg-orange-900 bg-opacity-30';
          textColorClass = 'text-orange-400';
          break;
        case 'low':
          bgColorClass = 'bg-green-900 bg-opacity-30';
          textColorClass = 'text-green-400';
          break;
      }
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColorClass} ${textColorClass}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };
  
  // Renders status badge with appropriate color
  const renderStatusBadge = (status: TaskStatus) => {
    let bgColorClass, textColorClass;
    
    if (theme === 'light') {
      switch (status) {
        case 'todo':
          bgColorClass = 'bg-gray-100';
          textColorClass = 'text-gray-800';
          break;
        case 'in_progress':
          bgColorClass = 'bg-blue-100';
          textColorClass = 'text-blue-800';
          break;
        case 'pending':
          bgColorClass = 'bg-yellow-100';
          textColorClass = 'text-yellow-800';
          break;
        case 'completed':
          bgColorClass = 'bg-green-100';
          textColorClass = 'text-green-800';
          break;
      }
    } else {
      switch (status) {
        case 'todo':
          bgColorClass = 'bg-gray-800 bg-opacity-30';
          textColorClass = 'text-gray-400';
          break;
        case 'in_progress':
          bgColorClass = 'bg-blue-900 bg-opacity-30';
          textColorClass = 'text-blue-400';
          break;
        case 'pending':
          bgColorClass = 'bg-yellow-900 bg-opacity-30';
          textColorClass = 'text-yellow-400';
          break;
        case 'completed':
          bgColorClass = 'bg-green-900 bg-opacity-30';
          textColorClass = 'text-green-400';
          break;
      }
    }
    
    const statusDisplay = status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColorClass} ${textColorClass}`}>
        {statusDisplay}
      </span>
    );
  };
  
  return (
    <div className={`w-full ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Task Management</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard/staff/tasks/new')}
              className={`px-3 py-2 rounded-md flex items-center ${
                theme === 'light'
                  ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                  : 'bg-teal-900 bg-opacity-30 text-teal-400 hover:bg-opacity-50'
              }`}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </button>
            
            <button
              onClick={fetchTasks}
              className={`p-2 rounded-md ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#1e2a45] text-gray-300 hover:bg-[#2a3448]'
              }`}
              aria-label="Refresh tasks"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mb-4">
            <ErrorDisplay 
              error={error} 
              onDismiss={clearError}
            />
          </div>
        )}
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 block w-full rounded-md ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900'
                  : 'border-[#2a3448] bg-[#1e2a45] text-white'
              } focus:ring-teal-500 focus:border-teal-500`}
            />
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-48 relative">
            <ClientSelector
              selectedClient={selectedClient}
              onClientChange={(client: Client | null) => setSelectedClient(client)}
              theme={theme}
              showClearButton={true}
            />
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-40 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              className={`pl-10 pr-4 py-2 block w-full rounded-md ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900'
                  : 'border-[#2a3448] bg-[#1e2a45] text-white'
              } focus:ring-teal-500 focus:border-teal-500`}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
        
        {/* Status tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  statusFilter === tab.value
                    ? theme === 'light'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-teal-900 bg-opacity-40 text-teal-400'
                    : theme === 'light'
                    ? 'bg-white text-gray-600 hover:bg-gray-100'
                    : 'bg-[#162238] text-gray-300 hover:bg-[#1e2a45]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <LoadingState 
            message="Loading tasks..." 
            theme={theme}
            context="Fetching your task list"
          />
        )}
        
        {/* No tasks message */}
        {!isLoading && filteredTasks.length === 0 && (
          <EmptyState 
            icon="clock"
            message={searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' || selectedClient
              ? "No tasks match your current filters" 
              : "There are no tasks assigned yet"}
            description={searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' || selectedClient
              ? "Try adjusting your search criteria or filters"
              : "Click the 'New Task' button to create one"}
            theme={theme}
            actionButton={
              error && (
                <button
                  onClick={fetchTasks}
                  className={`px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md transition-colors`}
                >
                  Retry
                </button>
              )
            }
          />
        )}
        
        {/* Tasks table */}
        {!isLoading && filteredTasks.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className={`min-w-full divide-y ${theme === 'light' ? 'border-gray-200 divide-gray-200' : 'border-[#2a3448] divide-[#2a3448]'}`}>
              <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}>
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Task</span>
                      {sortField === 'title' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Priority</span>
                      {sortField === 'priority' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Client</span>
                      {sortField === 'client' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Due Date</span>
                      {sortField === 'dueDate' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-[#2a3448]'}`}>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/dashboard/staff/tasks/${task.id}`)}
                          className="hover:underline text-left"
                        >
                          {task.title}
                        </button>
                      </div>
                      {task.description && (
                        <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} truncate max-w-xs`}>
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(task.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPriorityBadge(task.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{task.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm flex items-center ${
                        isOverdue(task.dueDate) && task.status !== 'completed' 
                          ? 'text-red-600 dark:text-red-400' 
                          : ''
                      }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(task.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => navigate(`/dashboard/staff/tasks/${task.id}`)}
                        className={`${
                          theme === 'light'
                            ? 'text-teal-600 hover:text-teal-800'
                            : 'text-teal-400 hover:text-teal-300'
                        }`}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
