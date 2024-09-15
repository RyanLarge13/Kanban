class Board {
 constructor(title, color, description, index, DOMNode) {
  this.title = title;
  this.color = color;
  this.description = description;
  this.index = index;
  this.DOMNode = DOMNode;
  this.children = [];
  this.dragging = false;
  this.xOffset = 0;
 }
 
 findTask(uid) {
  for (let i = 0; i < this.children.length; i++) {
   if (this.children[i].id === uid) {
    return this.children[i];
   }
  }
  return null;
 }
 
 draw() {
  const boardsHolder = document.getElementById("boards");
  const width = window.innerWidth;
  this.DOMNode.style.width = `${width}px`;
  this.DOMNode.style.minWidth = `${width - 50}px`;
  this.DOMNode.innerHTML = this.genHtml();
  boardsHolder.appendChild(this.DOMNode);
  for (let i = 0; i < this.children.length; i++) {
   this.children[i].draw();
   this.children[i].madeRoom = false
  }
 }
 
 move(e) {
  const x = e.clientX;
  this.DOMNode.style.transform = `translateX(${x - this.xOffset}px)`;
 }
 
 swapChildren(i, j) {
  [this.children[i], this.children[j]] = [this.children[j], this.children[i]];
 }
 
 removeChildTask(index) {
  this.DOMNode.removeChild(this.children[index].DOMNode)
 }
 
 init() {
  this.DOMNode = document.createElement("div");
 }
 
 genHtml() {
  const html = `
    <div class="board" style="background-color: ${this.color}">
      <button class="add-task-btn">+</button>
      <p class="board-drag-icon">|||</p>
      <div class="board-title-index">
       <h2 class="board-title">${this.title}</h2>
       <p class="board-index">${this.index + 1}</p>
      </div>
      <p class="board-children-len">${this.children.length} tasks</p>
      <p class="board-desc">${this.description}</p>
     <div class="task-items"></div>
   </div>
  `;
  return html;
 }
}

export default Board;
