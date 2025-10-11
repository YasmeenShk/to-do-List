const taskInput = document.getElementById("taskInput")
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filterBtn');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true"

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function saveTheme() {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
        document.documentElement.classList.add("dark")
        themeToggle.textContent = '🌞';

    }
    else {
        document.documentElement.classList.remove("dark")
        themeToggle.textContent = '🌙';
    }
}



//render task
function renderTasks(filter = "all") {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    if (filter === "active") filteredTasks = tasks.filter(t => !t.completed)
    if (filter === "completed") filteredTasks = tasks.filter(t => t.completed)

    //tasklist
    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li")
        li.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded transition-colors duration-300'

        li.innerHTML = ` 
        <div class="flex items-center gap-2">
            <input type="checkbox" ${task.completed ? 'checked' : ''} class="toggleCheckbox">
            <span class="${task.completed ? 'line-through text-gray-400 dark:text-gray-300' : 'text-gray-800 dark:text-gray-100'} editable">${task.name}</span>
          </div>
          <div class="flex gap-2">
            <button class="editBtn text-yellow-500 hover:text-yellow-700">Edit</button>
            <button class="deleteBtn text-red-500 hover:text-red-700">Delete</button>
          </div>
          `;

        li.querySelector(".toggleCheckbox").addEventListener("change", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks()
            renderTasks(filter)
        })

        li.querySelector(".deleteBtn").addEventListener("click", () => {
            tasks.splice(index, 1)
            saveTasks()
            renderTasks(filter)
        })

        li.querySelector(".editBtn").addEventListener("click", () => {
            const newName = prompt("Edit Task", task.name)
            if (newName) {
                task.name = newName
                saveTasks()
                renderTasks()
            }
        })

        taskList.appendChild(li)
    })
}

addBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    if (taskName) {
        tasks.push({ name: taskName, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
});
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    // Reset all buttons
    filterButtons.forEach(b => {
      b.classList.remove('bg-blue-500', 'text-white');
      b.classList.add('bg-gray-200', 'text-black');
    });

    btn.classList.remove('bg-gray-200', 'text-black');
    btn.classList.add('bg-blue-500', 'text-white');

    renderTasks(btn.dataset.filter);
  });
});



themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    saveTheme();
});

saveTheme();
renderTasks();

