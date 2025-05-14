const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Add CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// In-memory task storage
let tasks = [];
let idCounter = 1;

// GET /tasks: Retrieve all tasks with optional filtering
app.get('/tasks', (req, res) => {
  let filteredTasks = [...tasks];

  if (req.query.completed) {
    const isCompleted = req.query.completed === 'true';
    filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
  }

  if (req.query.due_date) {
    filteredTasks = filteredTasks.filter(task => task.due_date === req.query.due_date);
  }

  if (req.query.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === req.query.priority);
  }

  // ترتيب المهام
  console.log('Before sorting:', filteredTasks); // إضافة log قبل الترتيب
  filteredTasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityA = priorityOrder[a.priority.toLowerCase()] || 0;
    const priorityB = priorityOrder[b.priority.toLowerCase()] || 0;
    const priorityDiff = priorityB - priorityA;
    if (priorityDiff !== 0) return priorityDiff;

    const dateA = a.due_date ? new Date(a.due_date) : new Date('9999-12-31');
    const dateB = b.due_date ? new Date(b.due_date) : new Date('9999-12-31');
    return dateA - dateB;
  });
  console.log('After sorting:', filteredTasks); // إضافة log بعد الترتيب

  res.json(filteredTasks);
});

// POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, due_date, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = {
    id: idCounter++,
    title,
    description: description || '',
    due_date: due_date || null,
    priority: priority || 'medium',
    completed: false,
    created_at: new Date().toISOString()
  };

  tasks.push(task);
  res.status(201).json(task);
});

// GET /tasks/:id: Retrieve a specific task
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// PUT /tasks/:id: Update a task
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, due_date, priority, completed } = req.body;
  task.title = title || task.title;
  task.description = description !== undefined ? description : task.description;
  task.due_date = due_date !== undefined ? due_date : task.due_date;
  task.priority = priority || task.priority;
  task.completed = completed !== undefined ? completed : task.completed;

  res.json(task);
});

// DELETE /tasks/:id: Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// PUT /tasks/:id/complete: Mark task as completed
app.put('/tasks/:id/complete', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = true;
  res.json(task);
});

// PUT /tasks/:id/incomplete: Mark task as incomplete
app.put('/tasks/:id/incomplete', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = false;
  res.json(task);
});

// PUT /tasks/:id/priority: Update task priority
app.put('/tasks/:id/priority', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { priority } = req.body;
  if (!['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority level' });
  }

  task.priority = priority;
  res.json(task);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});