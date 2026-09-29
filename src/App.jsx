import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // Add Task
  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), status: "Raised", raisedAt: new Date().toLocaleString() }]);
  };

  // Update Task Status
  const updateStatus = (id, status) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Router>
      <div className="app">
        <h1>📋 Task Manager</h1>
        <nav>
          <Link to="/">Dashboard</Link> | 
          <Link to="/tasks">Tasks</Link> | 
          <Link to="/add">Add Task</Link> | 
          <Link to="/completed">Completed</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard tasks={tasks} />} />
          <Route path="/tasks" element={<TaskList tasks={tasks} updateStatus={updateStatus} deleteTask={deleteTask} />} />
          <Route path="/add" element={<TaskForm addTask={addTask} />} />
          <Route path="/task/:id" element={<TaskDetails tasks={tasks} />} />
          <Route path="/completed" element={<CompletedTasks tasks={tasks} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Dashboard Component
function Dashboard({ tasks }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Tasks: {tasks.length}</p>
      <p>Completed: {tasks.filter(t => t.status === "Closed").length}</p>
    </div>
  );
}

// Task List Component
function TaskList({ tasks, updateStatus, deleteTask }) {
  return (
    <div>
      <h2>All Tasks</h2>
      {tasks.map(t => (
        <div key={t.id} className="task-card">
          <h3>{t.header}</h3>
          <p>{t.description}</p>
          <p>Priority: {t.priority}</p>
          <p>Status: {t.status}</p>
          <button onClick={() => updateStatus(t.id, "Pending")}>Mark Pending</button>
          <button onClick={() => updateStatus(t.id, "Closed")}>Mark Completed</button>
          <button onClick={() => deleteTask(t.id)}>Delete</button>
          <Link to={`/task/${t.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

// Add Task Form
function TaskForm({ addTask }) {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({ header, description, priority, category });
    setHeader(""); setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Add Task</h2>
      <input type="text" placeholder="Task Header" value={header} onChange={(e) => setHeader(e.target.value)} required />
      <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Academic</option><option>Personal</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}

// Task Details Component
function TaskDetails({ tasks }) {
  const { id } = useParams();
  const task = tasks.find(t => t.id === parseInt(id));

  if (!task) return <p>Task not found!</p>;

  return (
    <div>
      <h2>{task.header}</h2>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Category: {task.category}</p>
      <p>Status: {task.status}</p>
      <p>Raised At: {task.raisedAt}</p>
    </div>
  );
}

// Completed Tasks Component
function CompletedTasks({ tasks }) {
  const completed = tasks.filter(t => t.status === "Closed");
  return (
    <div>
      <h2>Completed Tasks</h2>
      {completed.length === 0 ? <p>No completed tasks</p> : completed.map(t => <p key={t.id}>{t.header}</p>)}
    </div>
  );
}

export default App;
