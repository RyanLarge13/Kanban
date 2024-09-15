import { getRandomId } from "./helpers.js";

class Task {
 constructor(task, assignedTo, dueBy, tags, color, description, parent, index) {
  this.task = task;
  this.assignedTo = assignedTo;
  this.dueBy = dueBy;
  this.tags = tags;
  this.color = color;
  this.description = description;
  this.parent = parent;
  this.DOMNode = null;
  this.id = getRandomId();
  this.index = index;
  this.dragging = false;
  this.offSet = { x: 0, y: 0 };
  this.traveled = { x: 0, y: 0 };
  this.height = 0;
  this.madeRoom = false;
 }

 makeRoom(amount) {
  this.DOMNode.style.transition = "250ms ease-in-out";
  if (this.madeRoom) {
   this.DOMNode.style.transform = "translateY(0)";
   this.madeRoom = false;
  } else {
   this.DOMNode.style.transform = `translateY(${amount}px)`;
   this.madeRoom = true;
  }
  setTimeout(() => {
   this.DOMNode.style.transition = "none";
  }, 250);
 }

 swap(otherTask, x, y, sign) {
  const translation = (this.height + 10) * sign;
  otherTask.makeRoom(translation);
  this.parent.swapChildren(this.index, otherTask.index);
  const tmpIndex = this.index;
  this.index = otherTask.index;
  otherTask.index = tmpIndex;
  this.traveled = { x: x, y: y };
 }

 move(e) {
  const x = e.clientX;
  const y = e.clientY;
  this.DOMNode.style.transform = `translateX(${x - this.offSet.x}px) 
  translateY(${y - this.offSet.y}px)`;
  const diff = y - this.traveled.y;
  const isLess = diff <= -(this.height + 10);
  const isGreater = diff >= this.height + 10;
  if (isLess) {
   const prevTask = this.parent.children[this.index - 1];
   if (!prevTask) {
    return;
   }
   this.swap(prevTask, x, y, 1);
  }
  if (isGreater) {
   const nextTask = this.parent.children[this.index + 1];
   if (!nextTask) {
    return;
   }
   this.swap(nextTask, x, y, -1);
  }
 }

 home() {
  this.DOMNode.style.transition = "200ms ease-in-out";
  this.DOMNode.style.transform = "translateX(0) translateY(0)";
  setTimeout(() => {
   this.DOMNode.style.transition = "none";
  }, 200);
 }

 draw() {
  const newTask = document.createElement("div");
  const taskHtml = this.genHtml();
  newTask.innerHTML = taskHtml;
  this.DOMNode = newTask;
  this.parent.DOMNode.appendChild(newTask);
  const rect = this.DOMNode.getBoundingClientRect();
  this.height = rect.height;
 }

 genHtml() {
  return `
    <div id="task" class="task" data-uid="${this.id}">
      <div class="task-color" style="background-color: ${this.color}"></div>
      <p class="task-title">${this.task}</p>
      <p class="task-desc">${this.description}</p>
    </div>
  `;
 }
}

export default Task;
