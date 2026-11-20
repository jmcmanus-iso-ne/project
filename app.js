// Improved task interactions with form submission, Enter-key support, accessible check controls, live counts, and an empty state.

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskSummary() {
    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"}`;
    emptyState.classList.toggle("hidden", tasks.length > 0);
}

function syncTasksFromList() {
    tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
        text: li.querySelector(".task-text").textContent,
        completed: li.querySelector(".task-text").classList.contains("completed")
    }));
    saveTasks();
    updateTaskSummary();
}

function createTaskElement(task) {
    const li = document.createElement("li");

    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "task-checkbox";
    checkbox.setAttribute("aria-label", task.completed ? "Mark task incomplete" : "Mark task complete");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", `Delete ${task.text}`);

    li.append(checkbox, span, deleteBtn);
    taskList.appendChild(li);
}

function toggleTask(li) {
    const text = li.querySelector(".task-text");
    text.classList.toggle("completed");
    li.querySelector(".task-checkbox").setAttribute(
        "aria-label",
        text.classList.contains("completed") ? "Mark task incomplete" : "Mark task complete"
    );
    syncTasksFromList();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    const task = { text, completed: false };
    tasks.push(task);
    createTaskElement(task);
    saveTasks();
    updateTaskSummary();
    taskInput.value = "";
    taskInput.focus();
});

taskList.addEventListener("click", event => {
    const li = event.target.closest("li");
    if (!li) return;

    if (event.target.closest(".deleteBtn")) {
        li.remove();
        syncTasksFromList();
    } else if (event.target.closest(".task-checkbox") || event.target.closest(".task-text")) {
        toggleTask(li);
    }
});

tasks.forEach(createTaskElement);
updateTaskSummary();