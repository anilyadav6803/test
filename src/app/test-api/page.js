'use client';

import { useState, useEffect } from 'react';

export default function TaskTester() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
      setMessage(data.message);
    } catch (error) {
      setMessage('Error fetching tasks');
    }
  };

  // Create a new task
  const createTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      
      const data = await response.json();
      setMessage(data.message);
        if (response.ok) {
        setNewTaskTitle('');
        setTasks(prev => [...prev, data.task]); // Add the new task to existing array
      }
    } catch (error) {
      setMessage('Error creating task');
    }
    setLoading(false);
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });
        const data = await response.json();
      setMessage(data.message);
      
      if (response.ok) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
      }
    } catch (error) {
      setMessage('Error updating task');
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });
        const data = await response.json();
      setMessage(data.message);
      
      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      setMessage('Error deleting task');
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            API Task Tester
          </h1>
          
          {/* Status Message */}
          {message && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
              <p className="text-blue-800 dark:text-blue-200 text-sm">{message}</p>
            </div>
          )}

          {/* Create New Task */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Create New Task
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && createTask()}
              />
              <button
                onClick={createTask}
                disabled={loading || !newTaskTitle.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Tasks ({tasks.length})
            </h2>
            
            {tasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tasks yet. Create one above!
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {task.id}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div className="mt-6">
            <button
              onClick={fetchTasks}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Refresh Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
