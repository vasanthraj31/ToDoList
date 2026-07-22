import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import './App.css';

function App() {
  // State: list of todos from the backend
  const [todos, setTodos] = useState([]);
  // State: value of the input field
  const [inputValue, setInputValue] = useState('');
  // State: loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load todos when the page first loads (runs once)
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError('⚠️ Could not connect to backend. Is the .NET API running?');
    } finally {
      setLoading(false);
    }
  }

  // Add a new todo
  async function handleAdd() {
    if (!inputValue.trim()) return;
    try {
      const newTodo = await createTodo(inputValue.trim());
      setTodos([...todos, newTodo]);
      setInputValue('');
    } catch {
      setError('Failed to add todo.');
    }
  }

  // Toggle completed/not completed
  async function handleToggle(todo) {
    const updated = { ...todo, isCompleted: !todo.isCompleted };
    try {
      await updateTodo(updated);
      setTodos(todos.map(t => t.id === todo.id ? updated : t));
    } catch {
      setError('Failed to update todo.');
    }
  }

  // Delete a todo
  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete todo.');
    }
  }

  // Allow pressing Enter to add
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <div className="page">
      <div className="card">
        {/* Header */}
        <div className="header">
          <h1>📝 My Todo List</h1>
          <p className="subtitle">
            {completedCount}/{todos.length} tasks completed
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="dismiss-btn">✕</button>
          </div>
        )}

        {/* Input Section */}
        <div className="input-row">
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="add-btn" onClick={handleAdd}>
            + Add
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <p className="loading">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="empty">No todos yet! Add one above 🎉</p>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'done' : ''}`}>
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleToggle(todo)}
                />
                {/* Title */}
                <span className="todo-title">{todo.title}</span>
                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(todo.id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="footer">
          <span>React + .NET Full Stack Demo</span>
        </div>
      </div>
    </div>
  );
}

export default App;
