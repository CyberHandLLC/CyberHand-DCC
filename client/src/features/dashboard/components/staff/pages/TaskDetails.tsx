import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash, Calendar, Clock, User, CheckCircle, 
  AlertCircle, MessageSquare, Paperclip, Loader, Tag
} from 'lucide-react';

// Import error handling components
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';
import useApiError from '../../../../../hooks/useApiError';
import taskAPI from '../../../../../api/services/taskAPI';

// Import types
import { Task, TaskStatus, TaskPriority } from '../../../../../types/task';

// Import mock data for fallback
import { mockTasks } from '../../../../../mock/tasks';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: string;
  authorRole: string;
}

interface TaskDetailsProps {
  theme: 'light' | 'dark';
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ theme }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Partial<Task>>({});
  
  // Error handling
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch task details
  const fetchTaskDetails = async () => {
    if (!taskId) return;
    
    try {
      const response = await handleApiCall(
        taskAPI.getTaskById(taskId),
        { context: 'Fetching task details' }
      );
      
      if (response?.data) {
        setTask(response.data);
        setUpdatedTask(response.data);
      }
    } catch (err) {
      // Error already handled by useApiError hook
      console.error('Error fetching task details:', err);
      // Fall back to mock data as a last resort
      const mockTask = mockTasks.find(t => t.id.toString() === taskId);
      if (mockTask) {
        setTask(mockTask);
        setUpdatedTask(mockTask);
      }
    }
  };
  
  // Fetch task comments
  const fetchTaskComments = async () => {
    if (!taskId) return;
    
    try {
      const response = await handleApiCall(
        taskAPI.getTaskComments(taskId),
        { context: 'Fetching task comments' }
      );
      
      if (response?.data) {
        setComments(response.data);
      }
    } catch (err) {
      // Error already handled by useApiError hook
      console.error('Error fetching task comments:', err);
      // Set empty comments as fallback
      setComments([]);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchTaskDetails();
    fetchTaskComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);
  
  // Delete task
  const handleDeleteTask = async () => {
    if (!taskId) return;
    
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        const response = await handleApiCall(
          taskAPI.deleteTask(taskId),
          { context: 'Deleting task' }
        );
        
        if (response?.success) {
          navigate('/dashboard/staff/tasks');
        }
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };
  
  // Update task status
  const handleStatusChange = async (status: TaskStatus) => {
    if (!taskId || !task) return;
    
    try {
      const response = await handleApiCall(
        taskAPI.updateTaskStatus(taskId, status),
        { context: `Updating task status to ${status}` }
      );
      
      if (response?.data) {
        setTask({...task, status: response.data.status});
        setUpdatedTask({...updatedTask, status: response.data.status});
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };
  
  // Update task priority
  const handlePriorityChange = async (priority: TaskPriority) => {
    if (!taskId || !task) return;
    
    try {
      const response = await handleApiCall(
        taskAPI.updateTaskPriority(taskId, priority),
        { context: `Updating task priority to ${priority}` }
      );
      
      if (response?.data) {
        setTask({...task, priority: response.data.priority});
        setUpdatedTask({...updatedTask, priority: response.data.priority});
      }
    } catch (err) {
      console.error('Error updating task priority:', err);
    }
  };
  
  // Update task
  const handleUpdateTask = async () => {
    if (!taskId || !task) return;
    
    try {
      const response = await handleApiCall(
        taskAPI.updateTask(taskId, updatedTask),
        { context: 'Updating task details' }
      );
      
      if (response?.data) {
        setTask(response.data);
        setEditMode(false);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };
  
  // Add comment
  const handleAddComment = async () => {
    if (!taskId || !newComment.trim()) return;
    
    try {
      const response = await handleApiCall(
        taskAPI.addTaskComment(taskId, newComment),
        { context: 'Adding comment to task' }
      );
      
      if (response?.success) {
        fetchTaskComments(); // Refresh comments
        setNewComment(''); // Clear comment input
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Check if task is overdue
  const isOverdue = (task: Task | null) => {
    if (!task?.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    return taskDueDate < today && task.status !== 'completed';
  };
  
  // Render status badge
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColorClass} ${textColorClass}`}>
        {statusDisplay}
      </span>
    );
  };
  
  // Render priority badge
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColorClass} ${textColorClass}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };
  
  return (
    <div className={`w-full ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
      {/* Header with back button, title, and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className={`mr-3 p-2 rounded-full ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-[#1e2a45]'}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Task Details
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-2 ${theme === 'light' ? 'bg-teal-100 text-teal-800 hover:bg-teal-200' : 'bg-teal-900 bg-opacity-30 text-teal-400 hover:bg-opacity-50'} rounded-md flex items-center`}
          >
            <Edit className="h-4 w-4 mr-1" />
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
          <button
            onClick={handleDeleteTask}
            className={`px-3 py-2 ${theme === 'light' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-red-900 bg-opacity-30 text-red-400 hover:bg-opacity-50'} rounded-md flex items-center`}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-4">
          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
            onRetry={() => {
              clearError();
              fetchTaskDetails();
              fetchTaskComments();
            }}
          />
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading task details...</p>
        </div>
      )}
      
      {/* Task details */}
      {!isLoading && task && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main task details */}
          <div className={`md:col-span-2 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm`}>
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={updatedTask.title || ''}
                    onChange={(e) => setUpdatedTask({...updatedTask, title: e.target.value})}
                    className={`w-full px-3 py-2 rounded-md ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-[#2a3448] bg-[#1e2a45]'}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Description
                  </label>
                  <textarea
                    value={updatedTask.description || ''}
                    onChange={(e) => setUpdatedTask({...updatedTask, description: e.target.value})}
                    rows={4}
                    className={`w-full px-3 py-2 rounded-md ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-[#2a3448] bg-[#1e2a45]'}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setUpdatedTask({...updatedTask, dueDate: e.target.value})}
                    className={`w-full px-3 py-2 rounded-md ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-[#2a3448] bg-[#1e2a45]'}`}
                  />
                </div>
                
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleUpdateTask}
                    className={`px-4 py-2 ${theme === 'light' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-700 hover:bg-teal-800'} text-white rounded-md`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
                
                <div className="mb-6">
                  <p className={`whitespace-pre-wrap ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {task.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`${isOverdue(task) ? 'text-red-600 dark:text-red-400' : ''}`}>
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center">
                      <User className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span>Assigned to: {task.assignedTo}</span>
                    </div>
                  )}
                  
                  {task.assignedBy && (
                    <div className="flex items-center">
                      <User className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span>Assigned by: {task.assignedBy}</span>
                    </div>
                  )}
                  
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center flex-wrap">
                      <Tag className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-[#1e2a45] text-gray-300'}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Status and actions sidebar */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm`}>
            <h3 className="text-lg font-medium mb-4">Status</h3>
            
            <div className="space-y-4">
              <div>
                <div className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Current Status
                </div>
                {renderStatusBadge(task.status)}
              </div>
              
              <div>
                <div className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Priority
                </div>
                {renderPriorityBadge(task.priority)}
              </div>
              
              {task.createdAt && (
                <div>
                  <div className={`text-sm mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Created
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{formatDate(task.createdAt)}</span>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <div className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Update Status
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className={`py-2 px-3 text-sm flex justify-center items-center rounded ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-blue-900 bg-opacity-30 text-blue-400 hover:bg-opacity-50'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className={`py-2 px-3 text-sm flex justify-center items-center rounded ${
                      theme === 'light'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-green-900 bg-opacity-30 text-green-400 hover:bg-opacity-50'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange('todo')}
                    className={`py-2 px-3 text-sm flex justify-center items-center rounded ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-gray-800 bg-opacity-30 text-gray-400 hover:bg-opacity-50'
                    }`}
                  >
                    To Do
                  </button>
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className={`py-2 px-3 text-sm flex justify-center items-center rounded ${
                      theme === 'light'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-yellow-900 bg-opacity-30 text-yellow-400 hover:bg-opacity-50'
                    }`}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Pending
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Update Priority
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePriorityChange('high')}
                    className={`py-2 px-3 text-xs font-medium rounded ${
                      theme === 'light'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-red-900 bg-opacity-30 text-red-400 hover:bg-opacity-50'
                    }`}
                  >
                    High
                  </button>
                  <button
                    onClick={() => handlePriorityChange('medium')}
                    className={`py-2 px-3 text-xs font-medium rounded ${
                      theme === 'light'
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        : 'bg-orange-900 bg-opacity-30 text-orange-400 hover:bg-opacity-50'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handlePriorityChange('low')}
                    className={`py-2 px-3 text-xs font-medium rounded ${
                      theme === 'light'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-green-900 bg-opacity-30 text-green-400 hover:bg-opacity-50'
                    }`}
                  >
                    Low
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments section */}
          <div className={`md:col-span-3 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Comments
            </h3>
            
            {/* Comments list */}
            <div className="mb-4 space-y-4">
              {comments.length === 0 ? (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  No comments yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div 
                    key={comment.id}
                    className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{comment.author}</div>
                      <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            {/* Add comment form */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Add a comment
              </label>
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
                className={`w-full px-3 py-2 rounded-md mb-2 ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-[#2a3448] bg-[#1e2a45]'}`}
              />
              <div className="flex justify-between items-center">
                <button
                  className={`p-2 rounded ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-[#1e2a45]'}`}
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-2 rounded ${
                    newComment.trim()
                      ? theme === 'light'
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                      : theme === 'light'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 bg-opacity-30 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
