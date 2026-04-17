// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const FILE_PATH = path.join(__dirname, 'tasks.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Read tasks from JSON file
function getTasks() {
    return JSON.parse(fs.readFileSync(FILE_PATH));
}

// Save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(getTasks());
});

// Add new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();

    const newTask = {
        id: Date.now(),
        title: req.body.title,
        completed: false
    };

    tasks.push(newTask);
    saveTasks(tasks);

    res.json(newTask);
});

// Edit task
app.put('/tasks/:id', (req, res) => {
    let tasks = getTasks();

    tasks = tasks.map(task =>
        task.id == req.params.id ? { ...task, title: req.body.title } : task
    );

    saveTasks(tasks);
    res.json({ message: 'Task updated' });
});

// Mark complete
app.put('/tasks/complete/:id', (req, res) => {
    let tasks = getTasks();

    tasks = tasks.map(task =>
        task.id == req.params.id ? { ...task, completed: !task.completed } : task
    );

    saveTasks(tasks);
    res.json({ message: 'Task status changed' });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
    let tasks = getTasks();

    tasks = tasks.filter(task => task.id != req.params.id);

    saveTasks(tasks);
    res.json({ message: 'Task deleted' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});