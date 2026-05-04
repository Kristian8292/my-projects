let activeTasks = getactiveTasks();
let compliteTasks = getCompleteTasks();
let myName = "Kiki";

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

if (activeTasks.length > 0) {
  const textOldElement = document.getElementById("tasks-list");
  for (let i = 0; i < activeTasks.length; i++) {
    textOldElement.innerHTML += `
             <div>
                <input type="checkbox" class="checkbox">
                <textarea placeholder="Enter a title here..." class="inputText" data-id="${activeTasks[i].id}">${activeTasks[i].value}</textarea>
            </div>
        `;
  }
}

if (compliteTasks.length > 0) {
  const completedList = document.getElementById("comlitetasks-list");
  for (let i = 0; i < compliteTasks.length; i++) {
    completedList.innerHTML += `
            <div>
                <input type="checkbox" class="checkbox" checked>
                <textarea placeholder="Enter a title here..." class="inputText" data-id="${compliteTasks[i].id}">${compliteTasks[i].value}</textarea>
            </div>
        `;
  }
}

function toggleVisibility() {
  const completedContainer = document.getElementById("comlitetasks-list");
  completedContainer.style.display =
    completedContainer.style.display === "none" ? "block" : "none";
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

  taskRow.appendChild(checkbox);
  taskRow.appendChild(inputText);
  textElement.appendChild(taskRow);
}

function saveTasks() {
  const inputElements = document.querySelectorAll(".inputText");
  const checkboxElements = document.querySelectorAll(".checkbox");

  let active = [];
  let completed = [];

  for (let index = 0; index < inputElements.length; index++) {
    let taskData = {
      value: inputElements[index].value,
      check: checkboxElements[index].checked,
      id: inputElements[index].getAttribute("data-id"),
    };

    if (taskData.value.trim() !== "") {
      if (taskData.check === true) {
        completed.push(taskData);
      } else {
        active.push(taskData);
      }
    }
  }

  localStorage.setItem("myTasks", JSON.stringify(active));
  localStorage.setItem("campliteTasks", JSON.stringify(completed));

  
  console.log("Tasks saved automatically!");
}

function randomID() {
  return crypto.randomUUID();
}

document.addEventListener("focusout", (el) => {
  if (el.target.classList.contains("inputText")) {
    const textarea = el.target;
    
  
    if (textarea.value.trim() === "") {
      textarea.parentElement.remove(); 
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
    const tasksList = document.getElementById("tasks-list");
    const completedList = document.getElementById("comlitetasks-list");

    if (checkbox.checked) {
      completedList.appendChild(taskRow);
    } else {
      tasksList.appendChild(taskRow);
    }

    saveTasks();
  }
});
