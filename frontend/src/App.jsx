import { useEffect, useMemo, useState } from 'react';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './services/todoService';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      setError('⚠️ Could not connect to backend. Is the .NET API running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!inputValue.trim()) return;
    try {
      const newTodo = await createTodo(inputValue.trim());
      setTodos([...todos, newTodo]);
      setInputValue('');
      setError('');
    } catch {
      setError('Failed to add todo.');
    }
  }

  async function handleToggle(todo) {
    const updated = { ...todo, isCompleted: !todo.isCompleted };
    try {
      await updateTodo(updated);
      setTodos(todos.map(t => (t.id === todo.id ? updated : t)));
      setError('');
    } catch {
      setError('Failed to update todo.');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      setError('');
    } catch {
      setError('Failed to delete todo.');
    }
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditValue(todo.title);
  }

  async function saveEdit(todoId) {
    const trimmedTitle = editValue.trim();
    if (!trimmedTitle) return;

    const target = todos.find(todo => todo.id === todoId);
    if (!target) return;

    const updated = { ...target, title: trimmedTitle };

    try {
      await updateTodo(updated);
      setTodos(todos.map(todo => (todo.id === todoId ? updated : todo)));
      setEditingId(null);
      setEditValue('');
      setError('');
    } catch {
      setError('Failed to edit todo.');
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  async function clearCompleted() {
    try {
      const pendingTodos = todos.filter(todo => !todo.isCompleted);
      for (const todo of todos.filter(todo => todo.isCompleted)) {
        await deleteTodo(todo.id);
      }
      setTodos(pendingTodos);
      setError('');
    } catch {
      setError('Failed to clear completed todos.');
    }
  }

  const completedCount = todos.filter(t => t.isCompleted).length;

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(todo => !todo.isCompleted);
    if (filter === 'completed') return todos.filter(todo => todo.isCompleted);
    return todos;
  }, [filter, todos]);

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>📝 My Todo List</h1>
          <p className="subtitle">
            {completedCount}/{todos.length} tasks completed
          </p>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="dismiss-btn">✕</button>
          </div>
        )}

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

        <div className="toolbar">
          <div className="filter-group" role="tablist" aria-label="Todo filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
            <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
          <button className="secondary-btn" onClick={clearCompleted} disabled={completedCount === 0}>
            Clear completed
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading todos...</p>
        ) : visibleTodos.length === 0 ? (
          <p className="empty">No todos here yet! Add one above 🎉</p>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleToggle(todo)}
                />

                {editingId === todo.id ? (
                  <div className="edit-row">
                    <input
                      className="todo-input edit-input"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <button className="save-btn" onClick={() => saveEdit(todo.id)}>Save</button>
                    <button className="secondary-btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="todo-title">{todo.title}</span>
                    <div className="actions">
                      <button className="icon-btn" onClick={() => startEdit(todo)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(todo.id)}>🗑️</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="footer">
          <span>React + .NET Full Stack Demo</span>
        </div>
      </div>
    </div>
  );
}

export default App;
