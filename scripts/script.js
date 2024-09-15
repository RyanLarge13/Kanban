import Kanban from "./Kanban.js";
import Task from "./Task.js";
import hexColors from "./colors.js";

let kanban = new Kanban([], []);
let draggingElem = null;
let pickedColor;
let swipe = { on: false, offsetX: 0 };
let taskSelected = null;
let taskSelectTimeout = null;

const initialize = () => {
 createColors();
 addColorListeners();
 createAddBtn();
 createCloseAddBoard();
 createNewBoardBtn();
 const boardContainer = document.getElementById("boards-container");

 boardContainer.addEventListener("pointerdown", e => {
  if (e.target.matches(".add-task-btn")) {
   const boardIndex = Number(
    e.target.parentElement.querySelector(".board-index").innerText
   );
   const board = kanban.findBoard(boardIndex - 1);
   openAddTaskModal(board);
   return;
  }
  if (e.target.matches(".task")) {
   const boardIndex = Number(
    e.target.parentElement.parentElement.querySelector(".board-index").innerText
   );
   const board = kanban.findBoard(boardIndex - 1);
   const task = board.findTask(e.target.getAttribute("data-uid"));
   if (task) {
    taskSelectTimeout = setTimeout(() => {
     taskSelected = task;
     const rect = taskSelected.DOMNode.getBoundingClientRect();
     const x = e.clientX - rect.left;
     const y = e.clientY;
     taskSelected.offSet = { x: x, y: y };
     taskSelected.traveled = { x: x, y: y };
    }, 750);
   }
   return;
  }
  if (e.target.matches(".board-drag-icon")) {
   const elemTarget = e.target.parentElement;
   const index = Number(elemTarget.querySelector(".board-index").innerText);
   const board = kanban.findBoard(index - 1);
   const rect = board.DOMNode.getBoundingClientRect();
   board.xOffset = e.clientX - rect.left;
   if (!board) {
    alert("Something went wrong. Cannot find your board");
    return;
   }
   draggingElem = board;
   draggingElem.DOMNode.classList.add("dragging");
   return;
  }
  handleSwipe(e);
 });

 boardContainer.addEventListener("pointermove", e => {
  if (taskSelected) {
   moveTask(e);
   if (taskSelectTimeout) {
    clearTimeout(taskSelectTimeout);
    taskSelectTimeout = null;
   }
   return;
  }
  if (swipe.on) {
   moveBoardContainer(e);
   return;
  }
  if (draggingElem) {
   draggingElem.move(e);
   if (kanban.boards.length > 1) {
    kanban.checkSwap(e.pageX, draggingElem.index);
   }
  }
 });

 const moveTaskLeftRight = newBoardIndex => {
  const newParentBoard = kanban.boards[newBoardIndex];
  taskSelected.parent.removeChildTask(taskSelected.index);
  taskSelected.parent.children.splice(taskSelected.index, 1);
  taskSelected.parent.children.forEach(tsk => {
   if (tsk.index > taskSelected.index) {
    tsk.index -= 1;
   }
  });
  taskSelected.parent = newParentBoard;
  taskSelected.index = newParentBoard.children.length;
  newParentBoard.children.push(taskSelected);
 };

 const moveBoardLeftRight = (currentIndex, increment) => {
  const boardToSwitch = kanban.findBoard(currentIndex + increment);
  if (!boardToSwitch) {
   return;
  }
  kanban.resetStyles(currentIndex, boardToSwitch.index);
  draggingElem.index = boardToSwitch.index;
  boardToSwitch.index = currentIndex;
  kanban.swapBoards(draggingElem.index, boardToSwitch.index);
  kanban.drawBoards();
  kanban.index += increment;
  const boardContainer = document.getElementById("boards");
  swipe = { on: true, offsetX: 0, container: boardContainer };
  resetSwipe();
 };

 boardContainer.addEventListener("pointerup", e => {
  if (taskSelectTimeout) {
   clearTimeout(taskSelectTimeout);
   taskSelectTimeout = null;
  }
  if (taskSelected) {
   if (e.pageX < 100 && kanbanExists(-1)) {
    moveTaskLeftRight(kanban.index - 1);
   }
   if (e.pageX > window.innerWidth - 100 && kanbanExists(1)) {
    moveTaskLeftRight(kanban.index + 1);
   }
   taskSelected.offSet = { x: 0, y: 0 };
   kanban.drawBoards();
   taskSelected = null;
  }
  if (swipe.on) {
   moveKanban(e);
  }
  if (draggingElem) {
   draggingElem.DOMNode.classList.remove("dragging");
   if (kanban.boards.length > 1) {
    if (kanban.moved.left) {
     moveBoardLeftRight(draggingElem.index, -1);
    }
    if (kanban.moved.right) {
     moveBoardLeftRight(draggingElem.index, 1);
    }
    if (!kanban.moved.right && !kanban.moved.left) {
     homeBoard();
    }
    setTimeout(() => {
     kanban.moved = { left: false, right: false };
     draggingElem = null;
    }, 300);
   } else {
    homeBoard();
   }
  }
 });

 boardContainer.addEventListener("pointercancel", e => {
  clearTimeout(taskSelectTimeout);
  taskSelectTimeout = null;
  taskSelected = null;
  draggingElem = null;
 });
};

const moveTask = e => {
 if (!taskSelected) {
  return;
 }
 taskSelected.move(e);
};

const resetSwipe = () => {
 swipe.container.style.transition = `250ms ease-in-out`;
 swipe.container.style.transform = `translateX(-${
  (window.innerWidth - 25) * kanban.index
 }px)`;
 setTimeout(() => {
  swipe.container.style.transition = `none`;
  swipe = { on: false, offsetX: 0, container: null };
 }, 250);
};

const eWithin = event => {
 const within = event.pageX >= 100 && event.pageX <= window.innerWidth - 100;
 return within;
};

const kanbanExists = offset => {
 return kanban.boards[kanban.index + offset] ? true : false;
};

const moveKanban = e => {
 const within = eWithin(e);
 if (kanban.boards.length === 0 || within) {
  resetSwipe();
  return;
 }
 if (kanban.boards.length > 0) {
  if (e.pageX < 100) {
   if (kanban.index === kanban.boards.length - 1) {
    openAddModal();
    resetSwipe();
    return;
   }
   kanbanExists(1) ? (kanban.index += 1) : null;
   resetSwipe();
  }
  if (e.pageX > window.innerWidth - 100) {
   kanbanExists(-1) ? (kanban.index -= 1) : null;
   resetSwipe();
  }
 }
};

const handleSwipe = e => {
 if (kanban.boards.length < 1) {
  return;
 }
 const boardContainer = document.getElementById("boards");
 const rect = boardContainer.getBoundingClientRect();
 const x = e.clientX - rect.left;
 swipe = { on: true, offsetX: x, container: boardContainer };
};

const moveBoardContainer = e => {
 if (kanban.boards.length < 1) {
  return;
 }
 const delta = e.pageX - swipe.offsetX;
 swipe.container.style.transform = `translateX(${delta}px)`;
};

let handleCreateTaskListener;

const handleCreateTask = (e, taskModal, board, taskTitle, taskModalCreate) => {
 e.preventDefault();
 const taskDesc = document.getElementById("task-desc");
 const color = pickedColor;
 taskModal.classList.remove("show");
 const newTask = new Task(
  taskTitle.value,
  "RL",
  new Date(),
  [{ txt: "important!" }],
  color,
  taskDesc.value,
  board,
  board.children.length
 );
 board.children.push(newTask);
 kanban.drawBoards();
 taskTitle.value = "";
 taskDesc.value = "";
 taskModalCreate.removeEventListener("click", handleCreateTaskListener);
};


const openAddTaskModal = board => {
 if (!board) {
  return;
 }
 const taskModal = document.getElementById("add-task-modal");
 const boardTitle = document.getElementById("task-board-title");
 boardTitle.innerText = board.title;
 const taskModalCreate = document.getElementById("add-task-create");
 taskModal.classList.add("show");
 const taskTitle = document.getElementById("task-title");
 taskTitle.focus();
 handleCreateTaskListener = e =>
  handleCreateTask(e, taskModal, board, taskTitle, taskModalCreate);
 taskModalCreate.addEventListener("click", handleCreateTaskListener);
};

const homeBoard = () => {
 draggingElem.DOMNode.style.transition = "300ms ease-in-out";
 draggingElem.DOMNode.style.transform = "translateX(0px)";
 setTimeout(() => {
  draggingElem.DOMNode.style.transition = "none";
  draggingElem = null;
 }, 300);
};

const createColorDiv = index => {
 const newColor = document.createElement("div");
 newColor.classList.add("color");
 newColor.style.backgroundColor = hexColors[index];
 newColor.setAttribute("data-color", hexColors[index]);
 return newColor;
};

const createColorBoard = (index, parent) => {
 const newColor = createColorDiv(index);
 parent.appendChild(newColor);
};

const createColorTask = (index, parent) => {
 const newColor = createColorDiv(index);
 parent.appendChild(newColor);
};

const createColors = () => {
 const colors = document.getElementById("colors");
 const taskColors = document.getElementById("task-colors");
 for (let i = 0; i < hexColors.length; i++) {
  createColorBoard(i, colors);
  createColorTask(i, taskColors);
 }
};

const addColorListeners = () => {
 const colors = document.getElementById("colors");
 const taskColors = document.getElementById("task-colors");
 const parents = [colors, taskColors];
 parents.forEach(parent => {
  parent.addEventListener("click", e => {
   if (e.target.matches(".color")) {
    const child = e.target;
    pickedColor = child.getAttribute("data-color");
   }
  });
 });
};

const createAddBtn = () => {
 const addBtn = document.getElementById("add-board");
 addBtn.addEventListener("click", () => {
  openAddModal();
 });
};

const createCloseAddBoard = () => {
 const addModal = document.getElementById("add-board-modal");
 const closeModal = document.getElementById("close-add-board");
 closeModal.addEventListener("click", () => {
  addModal.classList.remove("show");
 });
};

const createNewBoardBtn = () => {
 const createBtn = document.getElementById("add-board-create");
 createBtn.addEventListener("click", e => {
  e.preventDefault();
  const title = document.getElementById("board-title");
  const desc = document.getElementById("board-description");
  kanban.createNewBoard({ title: title.value, pickedColor, desc: desc.value });
  const addModal = document.getElementById("add-board-modal");
  addModal.classList.remove("show");
  desc.value = "";
  title.value = "";
  kanban.index = kanban.boards.length - 1;
  const boardContainer = document.getElementById("boards");
  swipe = { on: true, offsetX: 0, container: boardContainer };
  resetSwipe();
 });
};

const openAddModal = () => {
 const addModal = document.getElementById("add-board-modal");
 addModal.classList.add("show");
 const title = document.getElementById("board-title");
 title.focus();
};

window.addEventListener("DOMContentLoaded", () => {
 initialize();
});
