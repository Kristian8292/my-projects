let activeTasks = getactiveTasks();
let compliteTasks = getCompleteTasks();
const today = new Date().toLocaleDateString();

function getCompleteTasks() {
  const savedTasksText = localStorage.getItem("campliteTasks");
  const tasksArray = JSON.parse(savedTasksText) || [];
  return tasksArray;
}

function getactiveTasks() {
  const savedTasksText = localStorage.getItem("myTasks");
  const tasksArray = JSON.parse(savedTasksText) || [];
  return tasksArray;
}

function updateRemainingCount() {
  const tasksList = document.getElementById("tasks-list");
  const count = tasksList.children.length;
  const reminderPara = document.getElementById("task-count");
  if (reminderPara) { 
    reminderPara.innerHTML = `${count} items remaining`;
  }
}

if (activeTasks.length > 0) {
  const textOldElement = document.getElementById("tasks-list");
  activeTasks.forEach((task) => {
    textOldElement.innerHTML += `
             <div>
                <input type="checkbox" class="checkbox">
                <textarea placeholder="Enter a title here..." class="inputText" data-id="${task.id}" data-date="${task.date}">${task.value}</textarea>
            </div>
        `;
  });
  updateRemainingCount();
}

if (compliteTasks.length > 0) {
  const todayList = document.getElementById("Completed-Today");
  const olderList = document.getElementById("Older");

  compliteTasks.forEach((task) => {
    const taskHtml = `
      <div>
        <input type="checkbox" class="checkbox" checked>
        <p class="input-p" data-id="${task.id}" data-date="${task.date}">${task.value}</p>
      </div>
    `;

    if (task.date === today) {
      todayList.innerHTML += taskHtml;
    } else {
      olderList.innerHTML += taskHtml;
    }
  });
}

function toggleVisibility() {
  const completedContainer = document.getElementById("comlitetasks-list");
  const todoContainer = document.getElementById("To-Do");
  const btnTodo = document.getElementById("button-to-do");
  const btnCompleted = document.getElementById("button-Complited");

  completedContainer.style.display = "block";
  todoContainer.style.display = "none";

  btnCompleted.style.color = "#4F46E5";
  btnCompleted.querySelector("path").setAttribute("fill", "#4F46E5");
  btnTodo.style.color = "#94A3B8";
  btnTodo.querySelector("path").setAttribute("fill", "#94A3B8");
}

function showTodo() {
  const completedContainer = document.getElementById("comlitetasks-list");
  const todoContainer = document.getElementById("To-Do");
  const btnTodo = document.getElementById("button-to-do");
  const btnCompleted = document.getElementById("button-Complited");

  completedContainer.style.display = "none";
  todoContainer.style.display = "flex";

  btnTodo.style.color = "#4F46E5";
  btnTodo.querySelector("path").setAttribute("fill", "#4F46E5");
  btnCompleted.style.color = "#94A3B8";
  btnCompleted.querySelector("path").setAttribute("fill", "#94A3B8");
}

function createTaskElement() {
  const textElement = document.getElementById("tasks-list");
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

  let active = [];
  let completed = [];

  allTasks.forEach((el) => {
    const taskRow = el.parentElement;
    const checkbox = taskRow.querySelector(".checkbox");

    let taskData = {
      value:
        el.tagName.toLowerCase() === "textarea" ? el.value : el.textContent,
      check: checkbox.checked,
      id: el.getAttribute("data-id"),
      date: el.getAttribute("data-date"),
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

function randomID() {
  return crypto.randomUUID();
}

document.addEventListener("focusout", (el) => {
  if (el.target.classList.contains("inputText")) {
    const textarea = el.target;
    if (textarea.value.trim() === "") {
      textarea.parentElement.remove();
      updateRemainingCount();
    } else {
      textarea.style.height = "";
      textarea.style.scrollTop = 0;
    }
    saveTasks();
  }
});

document.addEventListener("input", (el) => {
  if (el.target.classList.contains("inputText")) {
    const textarea = el.target;
    textarea.style.transition = "none";
    textarea.style.height = "40px";
    textarea.style.height = textarea.scrollHeight + "px";
  }
});

document.addEventListener("focusin", (el) => {
  if (el.target.classList.contains("inputText")) {
    const textarea = el.target;
    textarea.style.transition = "height 0.6s ease";
    
    textarea.style.height = textarea.scrollHeight + "px";
  }
});

document.addEventListener("change", (el) => {
  if (el.target.classList.contains("checkbox")) {
    const checkbox = el.target;
    const taskRow = checkbox.parentElement;
    const oldElement = taskRow.querySelector(".inputText, .input-p");

    const taskValue =
      oldElement.tagName.toLowerCase() === "textarea"
        ? oldElement.value
        : oldElement.textContent;
    const taskId = oldElement.getAttribute("data-id");

    if (checkbox.checked) {
      const newPara = document.createElement("p");
      newPara.className = "input-p";
      newPara.textContent = taskValue;
      newPara.setAttribute("data-id", taskId);
      newPara.setAttribute("data-date", today);

      oldElement.replaceWith(newPara);

      const todayList = document.getElementById("Completed-Today");

      todayList.appendChild(taskRow);
    } else {
      const newTextarea = document.createElement("textarea");
      newTextarea.className = "inputText";
      newTextarea.value = taskValue;
      newTextarea.placeholder = "Enter a title here...";
      newTextarea.setAttribute("data-id", taskId);
      newTextarea.setAttribute("data-date", today);

      oldElement.replaceWith(newTextarea);

      const tasksList = document.getElementById("tasks-list");
      tasksList.appendChild(taskRow);
    }

    updateRemainingCount();
    saveTasks();
  }
});

