import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check, X, Filter } from 'lucide-react';
import './App.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setDueDate('');
    setPriority('medium');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Filter todos
  let filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Search todos
  filteredTodos = filteredTodos.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort todos
  if (sortBy === 'priority') {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filteredTodos.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  } else {
    filteredTodos.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.filter((todo) => !todo.completed).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">✓ My Tasks</h1>
          <p className="text-blue-100">Stay organized and productive</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-blue-600">{todos.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm font-semibold mb-1">Active</p>
            <p className="text-3xl font-bold text-yellow-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 text-sm font-semibold mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={addTodo}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add a new task
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:flex-1">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Filter size={16} className="inline mr-1" />
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Clear */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
            </select>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-400 text-lg font-semibold mb-2">
                {todos.length === 0
                  ? '📝 No tasks yet. Add one to get started!'
                  : '🎉 No tasks in this filter'}
              </p>
              {todos.length > 0 && filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all tasks
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg shadow-md p-4 flex items-start gap-4 transition-all hover:shadow-lg ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-lg font-medium break-words ${
                      todo.completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.text}
                  </p>

                  {/* Metadata */}
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {/* Priority Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                        getPriorityColor(todo.priority)
                      }`}
                    >
                      {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </span>

                    {/* Due Date */}
                    {todo.dueDate && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                        📅 {formatDate(todo.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-4 text-center text-gray-600">
            <p className="font-semibold">
              {activeCount} active · {completedCount} completed · {todos.length} total
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-gray-800 text-gray-400 text-center py-6">
        <p>Built with React & Tailwind CSS | Local Storage Enabled</p>
      </footer>
    </div>
  );
}

export default App;
