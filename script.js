
const taskInput =
    document.getElementById(
        "task-input"
    );

const addBtn =
    document.getElementById(
        "add-btn"
    );

const taskList =
    document.getElementById(
        "task-list"
    );

const dueDate =
    document.getElementById(
        "due-date"
    );


const prioritySelect =
    document.getElementById(
        "priority"
    );

const searchInput =
    document.getElementById(
        "search-input"
    );

addBtn.addEventListener(
    "click",
    addTask
);
const allBtn = document.getElementById("all-btn");
const completedBtn = document.getElementById("completed-btn");
const pendingBtn = document.getElementById("pending-btn");
console.log(allBtn);
console.log(completedBtn);
console.log(pendingBtn);
allBtn.addEventListener("click", () => {

    document.querySelectorAll("#task-list li")
        .forEach(task => {
            task.style.display = "flex";
        });
});

completedBtn.addEventListener("click", () => {

    document.querySelectorAll("#task-list li")
        .forEach(task => {

            const span = task.querySelector("span");

            task.style.display =
                span.classList.contains("completed")
                ? "flex"
                : "none";
        });
});

pendingBtn.addEventListener("click", () => {

    document.querySelectorAll("#task-list li")
        .forEach(task => {

            const span = task.querySelector("span");

            task.style.display =
                !span.classList.contains("completed")
                ? "flex"
                : "none";
        });
}); 




function createTask(
    taskText,
    isCompleted = false,
    priority = "medium",
    date = ""
) {

    const li =
        document.createElement("li");

    li.innerHTML = `
    <div class="task-content">

        <span class="${priority}">
            ${taskText}
        </span>

        <small>
            📅 Due: ${date || "No date"}
        </small>

    </div>

    <button class="edit-btn">✏️</button>

    <button class="delete-btn">❌</button>
    `;
    const editBtn =
    li.querySelector(
        ".edit-btn"
    );
    const taskTextSpan =
    li.querySelector("span");

    editBtn.addEventListener(
        "click",
        () => {

            const newTask =
                prompt(
                "Edit Task:",
                taskTextSpan.textContent
                );

            if(
                newTask &&
                newTask.trim() !== ""
            ) {

                taskTextSpan.textContent =
                    newTask;

                saveTasks();
                updateStats();
            }
        }
    ); 


    if(isCompleted) {

        taskTextSpan.classList.add(
            "completed"
        );
    }

    taskTextSpan.addEventListener(
        "click",
        () => {

            taskTextSpan.classList.toggle(
                "completed"
            );

            saveTasks();
            updateStats();
        }
    );

    li.querySelector(".delete-btn")
        .addEventListener(
            "click",
            () => {

                li.remove();

                saveTasks();
                updateStats();
            }
        );

    taskList.appendChild(li);
}
function addTask() {

    const taskText =
        taskInput.value.trim();

    if(taskText === "") {

        return;
    }

    createTask(
    taskText,
    false,
    prioritySelect.value,
    dueDate.value
    );

    saveTasks();
    updateStats();

    taskInput.value = "";
}
function saveTasks() {

    const tasks = [];

    document
        .querySelectorAll(
            "#task-list li span"
        )
        .forEach(task => {

            tasks.push({

                text: task.textContent,

                completed:
                    task.classList.contains(
                        "completed"
                    )
            });

        });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}
function loadTasks() {

    const tasks =
        JSON.parse(
            localStorage.getItem(
                "tasks"
            )
        ) || [];

    tasks.forEach(task => {

        createTask(
        task.text,
        task.completed,
        task.priority
        );

    });
    
}
loadTasks();
updateStats();

searchInput.addEventListener(
    "keyup",
    () => {

        const searchText =
            searchInput.value
                .toLowerCase();

        const tasks =
            document.querySelectorAll(
                "#task-list li"
            );

        tasks.forEach(task => {

            const text =
                task.textContent
                    .toLowerCase();

            if(
                text.includes(
                    searchText
                )
            ) {

                task.style.display =
                    "flex";
            }

            else {

                task.style.display =
                    "none";
            }
        });
    }
);
allBtn.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                "#task-list li"
            )
            .forEach(task => {

                task.style.display =
                    "flex";
            });
    }
);
completedBtn.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                "#task-list li"
            )
            .forEach(task => {

                const span =
                    task.querySelector(
                        "span"
                    );

                if(
                    span.classList.contains(
                        "completed"
                    )
                ) {

                    task.style.display =
                        "flex";
                }

                else {

                    task.style.display =
                        "none";
                }
            });
    }
);
pendingBtn.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                "#task-list li"
            )
            .forEach(task => {

                const span =
                    task.querySelector(
                        "span"
                    );

                if(
                    !span.classList.contains(
                        "completed"
                    )
                ) {

                    task.style.display =
                        "flex";
                }

                else {

                    task.style.display =
                        "none";
                }
            });
    }
);
function updateStats() {

    const tasks =
        document.querySelectorAll(
            "#task-list li"
        );

    const completed =
        document.querySelectorAll(
            ".completed"
        );

    document.getElementById(
        "total-tasks"
    ).textContent =
        `Total: ${tasks.length}`;

    document.getElementById(
        "completed-tasks"
    ).textContent =
        `Completed: ${completed.length}`;

    document.getElementById(
        "pending-tasks"
    ).textContent =
        `Pending: ${
            tasks.length -
            completed.length
        }`;
}