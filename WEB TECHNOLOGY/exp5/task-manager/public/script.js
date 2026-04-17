// Load tasks when page opens
window.onload = loadTasks;

// Get all tasks from server
async function loadTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        taskList.innerHTML += `
            <tr>
                <td class="${task.completed ? 'completed' : ''}">${task.title}</td>
                <td>${task.completed ? 'Completed' : 'Pending'}</td>
                <td>
                    <button onclick="completeTask(${task.id})">Done</button>
                    <button onclick="editTask(${task.id}, '${task.title}')">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Add task
async function addTask() {
    const title = document.getElementById('taskInput').value;

    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    document.getElementById('taskInput').value = '';
    loadTasks();
}

// Delete task
async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

// Complete task
async function completeTask(id) {
    await fetch(`/tasks/complete/${id}`, { method: 'PUT' });
    loadTasks();
}

// Edit task
async function editTask(id, oldTitle) {
    const newTitle = prompt('Edit Task:', oldTitle);

    await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
    });

    loadTasks();
}