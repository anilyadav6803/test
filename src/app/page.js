"use client";


import Image from "next/image";
import { use, useEffect , useState } from "react";
import Axios from "axios";



export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input , setInput] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await Axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      const response = await Axios.post('/api/tasks', { title: input });
      setTasks([...tasks, response.data.task]);
      setInput('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  const toggleTaskCompletion = async (id) => {
    try {
      const response = await Axios.patch('/api/tasks', { id });
      setTasks(tasks.map(task => task.id === id ? response.data.task : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };
  const deleteTask = async (id) => {
    try {
      await Axios.delete('/api/tasks', { data: { id } });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1 className="text-3xl font-bold text-center">Task Manager</h1>
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Add a new task"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between">
              <span
                className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        
      </div>
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between">
            <span
              className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
      </div>
  );
}


