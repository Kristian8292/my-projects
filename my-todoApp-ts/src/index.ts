type Task = {
  id: string;
  value: string;
  date: string;
  check: boolean;
};

type Tasks = Task[];

let activeTasks = getactiveTasks();
let completeTasks = getCompleteTasks();
let today: string;

function updateToday () {
  today = new Date().toLocaleDateString();
}

updateToday();

function getCompleteTasks(): Tasks {
  const savedTasksText = localStorage.getItem("campliteTasks");
  let tasksArray = [];
  if (savedTasksText) {
    tasksArray = JSON.parse(savedTasksText);
  }

  return tasksArray;
}

function getactiveTasks(): Tasks {
  const savedTasksText = localStorage.getItem("myTasks");
  let tasksArray = [];
  if (savedTasksText) {
    tasksArray = JSON.parse(savedTasksText);
  }
  return tasksArray;
}

function getElementByQuerySelector(query: string) {
  return (document.querySelector(query) as HTMLElement) || new HTMLElement();
}

function updateRemainingCount() {
  const tasksList = getElementByQuerySelector("#tasks-list");
  let numberOfActiveTasks = 0;
  if (tasksList) {
    numberOfActiveTasks = tasksList.children.length;
  }

  const reminderPara = document.getElementById("task-count");
  if (reminderPara) {
    reminderPara.innerHTML = `${numberOfActiveTasks} items remaining`;
  }
}
function randomID(): string {
  return crypto.randomUUID();
}

if (activeTasks.length > 0) {
  const textOldElement = getElementByQuerySelector("#tasks-list");
  activeTasks.forEach((task) => {
    if (textOldElement) {
      textOldElement.innerHTML += `
             <div>
                <input type="checkbox" class="checkbox">
                <textarea placeholder="Enter a title here..." class="inputText" data-id="${task.id}" data-date="${task.date}">${task.value}</textarea>
            </div>
        `;
    }
  });
  updateRemainingCount();
}

if (completeTasks.length > 0) {
  const todayList = getElementByQuerySelector("#Completed-Today");
  const olderList = getElementByQuerySelector("#Older");

  completeTasks.forEach((task: Task) => {
    const taskHtml = `
      <div>
        <input type="checkbox" class="checkbox" checked>
        <p class="input-p" data-id="${task.id}" data-date="${task.date}">${task.value}</p>
      </div>
    `;

    if (task.date === today) {
      todayList!.innerHTML += taskHtml;
    } else {
      olderList!.innerHTML += taskHtml;
    }
  });
}

function showCompleteTasks() {
  const comliteTasksContainer = getElementByQuerySelector("#comlitetasks-list");
  const activeTaskFocusTitle = getElementByQuerySelector("#Focus-id");
  const tasksListContainer = getElementByQuerySelector("#tasks-list");
  const btnTodo = getElementByQuerySelector("#button-to-do");
  const btnCompleted = getElementByQuerySelector("#button-Complited");

  comliteTasksContainer.style.display = "block";
  activeTaskFocusTitle.style.display = "none";
  tasksListContainer.style.display = "none";

  btnCompleted.style.color = "#4F46E5";
  getElementByQuerySelector("#button-Complited path").setAttribute("fill", "#4F46E5");
  btnTodo.style.color = "#94A3B8";
  getElementByQuerySelector("#button-to-do path").setAttribute("fill", "#94A3B8");
}

function showActiveTasks() {
  const comliteTasksContainer = getElementByQuerySelector("#comlitetasks-list");
  const activeTaskFocusTitle = getElementByQuerySelector("#Focus-id");
  const tasksListContainer = getElementByQuerySelector("#tasks-list");
  const btnTodo = getElementByQuerySelector("#button-to-do");
  const btnCompleted = getElementByQuerySelector("#button-Complited");

  comliteTasksContainer.style.display = "none";
  activeTaskFocusTitle.style.display = "flex";
  tasksListContainer.style.display = "block";

  btnTodo.style.color = "#4F46E5";
  getElementByQuerySelector("#button-to-do path").setAttribute("fill", "#4F46E5");
  btnCompleted.style.color = "#94A3B8";
  getElementByQuerySelector("#button-Complited path").setAttribute("fill", "#94A3B8");
}
function createTaskElement() {
  const textElement = getElementByQuerySelector("#tasks-list");
  const taskRow = document.createElement("div");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";

  const inputText = document.createElement("textarea");
  inputText.className = "inputText";
  inputText.placeholder = "Enter a title here...";
  inputText.setAttribute("data-id", randomID());
  inputText.setAttribute("data-date", today);

  taskRow.appendChild(checkbox);
  taskRow.appendChild(inputText);
  textElement.appendChild(taskRow);

  updateRemainingCount();
}
function saveTasks() {
  const allTasks = document.querySelectorAll(".inputText, .input-p");

  let active: Task[] = [];
  let completed: Task[] = [];

  allTasks.forEach((el) => {
    const checkbox = document.querySelector("#checkbox") as HTMLInputElement;

    let taskValue: string = "";

    if (el instanceof HTMLTextAreaElement) {
      taskValue = el.value;
    } else {
      taskValue = el.textContent;
    }

    let taskData: Task = {
      value: taskValue,
      check: checkbox.checked,
      id: el.getAttribute("data-id") || "",
      date: el.getAttribute("data-date") || "",
    };

    if (taskData.value.trim() !== "") {
      if (taskData.check === true) {
        completed.push(taskData);
      } else {
        active.push(taskData);
      }
    }
  });

  localStorage.setItem("myTasks", JSON.stringify(active));
  localStorage.setItem("campliteTasks", JSON.stringify(completed));
}

document.addEventListener("focusin", (event) => {
  const focusTarget = event.target;

  if (
    focusTarget instanceof HTMLTextAreaElement &&
    focusTarget.classList.contains("inputText")
  ) {
    focusTarget.style.transition = "height 0.6s ease";
    focusTarget.style.height = focusTarget.scrollHeight + "px";
  }
});

document.addEventListener("input", (event) => {
  const inputTarget = event.target;
  if (
    inputTarget instanceof HTMLTextAreaElement &&
    inputTarget.classList.contains("inputText")
  ) {
    inputTarget.style.transition = "none";
    inputTarget.style.height = "40px";
    inputTarget.style.height = inputTarget.scrollHeight + "px";
  }
});

document.addEventListener("focusout", (event) => {
  const focusoutTarget = event.target as HTMLElement;
  if (
    focusoutTarget instanceof HTMLTextAreaElement &&
    focusoutTarget.classList.contains("inputText")
  ) {
    if (focusoutTarget.textContent.trim() === "" && focusoutTarget.parentElement) {
      focusoutTarget.parentElement.remove();
      updateRemainingCount();
    } else {
      focusoutTarget.style.height = "";
      focusoutTarget.scrollTop = 0;
    }
    saveTasks();
  }
});

document.addEventListener("change", (event) => {
  const checkbox = event.target;

  if (checkbox instanceof HTMLInputElement && checkbox.classList.contains("checkbox")) {
    const taskRow = checkbox.parentElement;
    if (!taskRow) {
      return;
    }

    const activeOrCompleteTask = taskRow.querySelector(
      ".inputText, .input-p",
    ) as HTMLElement;
    if (!activeOrCompleteTask) {
      return;
    }

    let taskValue: string = "";
    if (activeOrCompleteTask instanceof HTMLTextAreaElement) {
      taskValue = activeOrCompleteTask.value;
    } else {
      taskValue = activeOrCompleteTask.textContent;
    }

    const taskId = activeOrCompleteTask.getAttribute("data-id") || "";
    updateToday();

    if (checkbox.checked) {
      const paraCompleteTask = document.createElement("p");
      paraCompleteTask.className = "input-p";
      paraCompleteTask.textContent = taskValue;
      paraCompleteTask.setAttribute("data-id", taskId);
      paraCompleteTask.setAttribute("data-date", today);

      activeOrCompleteTask.replaceWith(paraCompleteTask);
      document.getElementById("Completed-Today")!.appendChild(taskRow);
    } else {
      
      const newTextarea = document.createElement("textarea");
      newTextarea.className = "inputText";
      newTextarea.value = taskValue;
      newTextarea.placeholder = "Enter a title here...";
      newTextarea.setAttribute("data-id", taskId);
      newTextarea.setAttribute("data-date", today);

      activeOrCompleteTask.replaceWith(newTextarea);
      document.getElementById("tasks-list")?.appendChild(taskRow);
    }

    updateRemainingCount();
    saveTasks();
  }
});
