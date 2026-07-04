const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const allBtn = document.getElementById('all-btn');
const completedBtn = document.getElementById('completed-btn');
const pendingBtn = document.getElementById('pending-btn');
const clearBtn = document.getElementById('clear-btn');

// Stats elements
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tabs'); // Wait, we have id pending-tasks
// Actually we have pending-tasks, let's correct.

const pendingTasksEl = document.getElementById('pending-tasks');

// State
let tasks = []; // array of objects: {text, completed, priority, date}
let filter = 'all'; // all, completed, pending

// Init
function init() {
    loadTasks();
    render();
    setThemeFromStorage();
}
init();

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

themeToggle.addEventListener('click', toggleTheme);

allBtn.addEventListener('click', () => setFilter('all'));
completedBtn.addEventListener('click', () => setFilter('completed'));
pendingBtn.addEventListener('click', () => setFilter('pending'));
clearBtn.addEventListener('click', clearCompleted);
searchInput.addEventListener('input', debounce(filterTasks, 300));

// Functions
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    const task = {
        text,
        completed: false,
        priority: prioritySelect.value,
        date: dueDateInput.value
    };
    tasks.push(task);
    saveTasks();
    render();
    // reset form
    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'medium';
    taskInput.focus();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function setThemeFromStorage() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('.theme-icon');
    const label = themeToggle.querySelector('.theme-label');
    if (isDark) {
        icon.textContent = '☀️';
        label.textContent = 'Light Mode';
    } else {
        icon.textContent = '🌙';
        label.textContent = 'Dark Mode';
    }
}

function setFilter(f) {
    filter = f;
    // update active button
    [allBtn, completedBtn, pendingBtn].forEach(btn => {
        btn.classList.toggle('active', btn.id === `${f}-btn` || (f === 'all' && btn.id === 'all-btn'));
    });
    render();
}

function filterTasks() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = tasks.filter(t => t.text.toLowerCase().includes(query));
    renderFiltered(filtered);
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
}

function render() {
    // filter based on filter state
    let filtered = tasks;
    if (filter === 'completed') filtered = tasks.filter(t => t.completed);
    else if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
    renderFiltered(filtered);
}

function renderFiltered(list) {
    taskList.innerHTML = '';
    if (list.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = 'No tasks match';
        taskList.appendChild(li);
        updateStats();
        return;
    }
    list.forEach((task, index) => {
        const li = document.createElement('li');
        li.dataset.index = tasks.indexOf(task); // map to original tasks array index
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text ${task.priority} ${task.completed ? 'completed' : ''}">${task.text}</span>
                <div class="task-meta">
                    ${task.date ? `<span class="due-date">📅 ${task.date}</span>` : ''}
                    <span class="priority">⚡ ${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task">✏️</button>
                <button class="delete-btn" aria-label="Delete task">❌</button>
            </div>
        `;
        // Edit
        li.querySelector('.edit-btn').addEventListener('click', () => editTask(task));
        // Delete
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task));
        // Toggle complete on click of task text
        li.querySelector('.task-text').addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            render();
        });
        taskList.appendChild(li);
    });
    updateStats();
}

function editTask(oldTask) {
    const newText = prompt('Edit task:', oldTask.text);
    if (newText === null) return; // cancelled
    const trimmed = newText.trim();
    if (trimmed === '') {
        alert('Task cannot be empty');
        return;
    }
    // find index
    const idx = tasks.findIndex(t => t === oldTask);
    if (idx !== -1) {
        tasks[idx].text = trimmed;
        saveTasks();
        render();
    }
}

function deleteTask(taskToDelete) {
    if (!confirm('Delete this task?')) return;
    tasks = tasks.filter(t => t !== taskToDelete);
    saveTasks();
    render();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // also update filter UI? not needed
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse tasks', e);
            tasks = [];
        }
    } else {
        tasks = [];
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    totalTasksEl.textContent = `Total: ${total}`;
    completedTasksEl.textContent = `Completed: ${completed}`;
    pendingTasksEl.textContent = `Pending: ${pending}`;
}

// Simple debounce
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}