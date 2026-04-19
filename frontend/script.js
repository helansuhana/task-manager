const API_URL = "http://127.0.0.1:8000";

const messageEl = document.getElementById("message");
const taskListEl = document.getElementById("task-list");

function showMessage(message, isError = false) {
    messageEl.textContent = message;
    messageEl.style.color = isError ? "red" : "green";
}

function getToken() {
    return localStorage.getItem("token");
}

function clearTaskInputs() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
}

function logoutUser() {
    localStorage.removeItem("token");
    taskListEl.innerHTML = "";
    showMessage("Logged out successfully");
}

async function registerUser() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        showMessage("Registration successful");
    } else {
        showMessage(data.detail || "Registration failed", true);
    }
}

async function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.access_token);
        showMessage("Login successful");
        loadTasks();
    } else {
        showMessage(data.detail || "Login failed", true);
    }
}

async function createTask() {
    const token = getToken();
    if (!token) {
        showMessage("Please login first", true);
        return;
    }

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;

    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (response.ok) {
        showMessage("Task created successfully");
        clearTaskInputs();
        loadTasks();
    } else {
        showMessage(data.detail || "Failed to create task", true);
    }
}

async function loadTasks() {
    const token = getToken();
    if (!token) {
        showMessage("Please login first", true);
        return;
    }

    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();
    taskListEl.innerHTML = "";

    if (!response.ok) {
        showMessage(data.detail || "Failed to load tasks", true);
        return;
    }

    if (data.length === 0) {
        taskListEl.innerHTML = "<li>No tasks found yet.</li>";
        showMessage("No tasks available");
        return;
    }

    data.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-header">
                <strong>${task.title}</strong>
                <span class="status ${task.completed ? "completed" : "pending"}">
                    ${task.completed ? "Completed" : "Pending"}
                </span>
            </div>
            <div>${task.description || "No description provided."}</div>
            <div class="task-actions">
                <button onclick="completeTask(${task.id})" ${task.completed ? "disabled" : ""}>Complete</button>
                <button class="secondary-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskListEl.appendChild(li);
    });

    showMessage("Tasks loaded");
}

async function completeTask(taskId) {
    const token = getToken();

    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
    });

    if (response.ok) {
        showMessage("Task marked as completed");
        loadTasks();
    } else {
        const data = await response.json();
        showMessage(data.detail || "Failed to update task", true);
    }
}

async function deleteTask(taskId) {
    const token = getToken();

    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.ok) {
        showMessage("Task deleted");
        loadTasks();
    } else {
        const data = await response.json();
        showMessage(data.detail || "Failed to delete task", true);
    }
}

document.getElementById("register-btn").addEventListener("click", registerUser);
document.getElementById("login-btn").addEventListener("click", loginUser);
document.getElementById("create-task-btn").addEventListener("click", createTask);
document.getElementById("load-tasks-btn").addEventListener("click", loadTasks);
document.getElementById("logout-btn").addEventListener("click", logoutUser);
