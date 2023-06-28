const newTodoInput = document.querySelector(".newTodoInput");
const newTodoCheck = document.querySelector("#newTodo");
const allBtn = document.querySelector("#all");
const activeBtn = document.querySelector("#active");
const completedBtn = document.querySelector("#completed");
const clearBtn = document.querySelector("#clearBtn");
const themeToggler = document.querySelector(".header button");
const imgs = document.querySelectorAll(".header button img");
const background = document.querySelectorAll(".background");
let curTheme = 1;
let itemsLeft = 0;
let previousView = "all";

let todos = [];
if (localStorage.getItem("AllTodos")) {
  todos = JSON.parse(localStorage.getItem("AllTodos"));
} else {
  todos = [
    {
      id: "firstTodo",
      checked: false,
      text: "Complete online JavaScript course",
    },
    { id: "secondTodo", checked: false, text: "Jog around the park 3x" },
    { id: "thirdTodo", checked: false, text: "10 minutes meditation" },
  ];
}

todos.forEach((todo) => {
  itemsLeft += !todo.checked;
  const li = document.createElement("li");
  li.draggable = true;
  li.className = "item";
  li.innerHTML = `<label for="${todo.id}"
  ><input type="checkbox" onclick="updateStyles(event)" id="${todo.id}" ${
    todo.checked ? "checked" : ""
  }><span></span></label>
  <p class=${todo.checked ? "checked" : ""}>${todo.text}</p>
    <button onclick="deleteItem(event)"><img src="images/icon-cross.svg" alt="cross" /></button>
    `;
  li.addEventListener("click", clickHandlerItem);
  addEventsDragAndDrop(li);
  document.querySelector(".list").append(li);
});

updateCount();

function focusInput(){
  newTodoInput.focus();
}

function updateStyles(event) {
  event.preventDefault();//preventing default checking of checkbox so that it can be checked by event listener of its parent parent, i.,e li
  event.stopPropagation();
}

function clickHandlerItem(e) {
  const li = e.currentTarget;
  const input = li.firstElementChild.firstElementChild;
  const listItem = todos.find((todo) => todo.id === input.id);
  input.checked = !input.checked;
  input.checked?input.setAttribute("checked", "checked"):input.removeAttribute("checked");

  listItem.checked = input.checked;
  if (
    (previousView == "active" && input.checked) ||
    (previousView == "complete" && !input.checked)
  )
    li.classList.add("hidden");
  itemsLeft += input.checked ? -1 : 1;
  updateCount();
  const p = input.parentNode.nextElementSibling;
  input.checked ? p.classList.add("checked") : p.classList.remove("checked");
}

function deleteItem(event) {
  event.stopPropagation();
  const button = event.currentTarget;
  const input = button.parentNode.firstElementChild.firstElementChild;
  itemsLeft -= !input.checked;
  todos = todos.filter((todo) => todo.id !== input.id);
  updateCount();
  const li = button.parentNode;
  li.parentNode.removeChild(li);
}

themeToggler.addEventListener("click", () => {
  imgs[curTheme].classList.add("hidden");
  background[curTheme].classList.add("hidden");
  curTheme == 0
    ? (document.body.classList = "light")
    : (document.body.classList = "dark");
  curTheme = (curTheme + 1) % 2;
  imgs[curTheme].classList.remove("hidden");
  background[curTheme].classList.remove("hidden");
});

newTodoInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && newTodoInput.value !== "") {
    itemsLeft += !newTodoCheck.checked;
    const li = document.createElement("li");
    li.addEventListener("click", clickHandlerItem);
    li.draggable = true;
    const randId = generateRandomId();
    li.className = "item";
    li.innerHTML = `<label for="${randId}"
    ><input type="checkbox" onclick="updateStyles(event)" id="${randId}" ${
      newTodoCheck.checked ? "checked" : ""
    }><span></span></label>
    <p class=${newTodoCheck.checked ? "checked" : ""}>${newTodoInput.value}</p>
    <button onclick="deleteItem(event)"><img src="images/icon-cross.svg" alt="cross" /></button>
    `;
    addEventsDragAndDrop(li);
    todos.unshift({
      id: randId,
      checked: newTodoCheck.checked,
      text: newTodoInput.value,
    });
    document.querySelector(".list").prepend(li);
    updateCount();
    newTodoInput.value = "";
    newTodoCheck.checked = false;
  }
});

function generateRandomId() {
  return Math.random().toString(36).substr(2, 5);
}

allBtn.addEventListener("click", () => {
  if (previousView !== "all") {
    previousView = "all";
    allBtn.classList.add("active");
    activeBtn.classList.remove("active");
    completedBtn.classList.remove("active");
    const items = document.querySelectorAll(".item");
    items.forEach((item) => item.classList.remove("hidden"));
  }
});

activeBtn.addEventListener("click", () => {
  if (previousView !== "active") {
    previousView = "active";
    allBtn.classList.remove("active");
    activeBtn.classList.add("active");
    completedBtn.classList.remove("active");
    const items = document.querySelectorAll(".item");
    items.forEach((item) => {
      if (item.firstElementChild.firstElementChild.checked) {
        item.classList.add("hidden");
      } else {
        item.classList.remove("hidden");
      }
    });
  }
});

completedBtn.addEventListener("click", () => {
  if (previousView !== "complete") {
    previousView = "complete";
    allBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    completedBtn.classList.add("active");
    const items = document.querySelectorAll(".item");
    items.forEach((item) => {
      if (!item.firstElementChild.firstElementChild.checked) {
        item.classList.add("hidden");
      } else {
        item.classList.remove("hidden");
      }
    });
  }
});

clearBtn.addEventListener("click", () => {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    if (item.firstElementChild.firstElementChild.checked) {
      document.querySelector(".list").removeChild(item);
    }
  });
  todos = todos.filter((todo) => !todo.checked);
  updateCount();
});

function updateCount() {
  document.querySelector(
    ".activeCount"
  ).textContent = `${itemsLeft} items left`;
  localStorage.setItem("AllTodos", JSON.stringify(todos));
}

// drag and drop feature
let dragSrcEl;
function dragStart(e) {
  this.style.opacity = "0.4";
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function dragEnter(e) {
  if(dragSrcEl != this)
  this.classList.add("over");
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function dragDrop(e) {
  if (dragSrcEl != this) {
    const curId = this.firstElementChild.firstElementChild.id;
    const prevId = dragSrcEl.firstElementChild.firstElementChild.id;
    const prevIdx = todos.findIndex((todo) => todo.id == prevId);
    const curIdx = todos.findIndex((todo) => todo.id == curId);
    const prevVal = todos[prevIdx];
    todos[prevIdx] = todos[curIdx];
    todos[curIdx] = prevVal;
    updateCount();
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
}

function dragEnd(e) {
  var listItens = document.querySelectorAll(".item");
  [].forEach.call(listItens, function (item) {
    item.classList.remove("over");
  });
  this.style.opacity = "1";
}

function addEventsDragAndDrop(el) {
  el.addEventListener("dragstart", dragStart, false);
  el.addEventListener("dragenter", dragEnter, false);
  el.addEventListener("dragover", dragOver, false);
  el.addEventListener("dragleave", dragLeave, false);
  el.addEventListener("drop", dragDrop, false);
  el.addEventListener("dragend", dragEnd, false);
}
