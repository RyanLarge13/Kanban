import Board from "./Board.js";

class Kanban {
 constructor(boards = [], tasks = []) {
  this.boards = boards;
  this.tasks = tasks;
  this.index = 0;
  this.moved = { left: false, right: false };
  this.drawBoards();
 }
 
 findBoard(boardIndex) {
  const board = this.boards[boardIndex];
  if (board) {
   return board;
  }
  return null;
 }
 
 checkSwap(x, dragBoardIndex) {
  const leftBoard = this.findBoard(dragBoardIndex - 1);
  const rightBoard = this.findBoard(dragBoardIndex + 1);
  if (x < 50) {
   if (leftBoard) {
    leftBoard.DOMNode.style.transition = `300ms ease-in-out`;
    leftBoard.DOMNode.style.transform = `translateX(calc(100% + 25px))`;
    this.moved.left = true;
   }
  }
  if (x > window.innerWidth - 50) {
   if (rightBoard) {
    rightBoard.DOMNode.style.transition = `300ms ease-in-out`;
    rightBoard.DOMNode.style.transform = `translateX(calc(-100% - 25px))`;
    this.moved.right = true;
   }
  }
  if (x <= window.innerWidth - 50 && x >= 50) {
   if (this.moved.left && leftBoard) {
    leftBoard.DOMNode.style.transform = `translateX(0)`;
    this.moved.left = false;
   }
   if (this.moved.right && rightBoard) {
    rightBoard.DOMNode.style.transform = `translateX(0)`;
    this.moved.right = false;
   }
  }
 }
 
 resetStyles(index1, index2) {
  this.boards[index1].DOMNode.style.transition = "none";
  this.boards[index2].DOMNode.style.transition = "none";
  this.boards[index1].DOMNode.style.transform = "translateX(0)";
  this.boards[index2].DOMNode.style.transform = "translateX(0)";
 }
 
 removeBoards() {
  const boardsHolder = document.getElementById("boards");
  while (boardsHolder.children[0]) {
   boardsHolder.removeChild(boardsHolder.children[0]);
  }
 }
 
 drawBoards() {
  this.removeBoards();
  for (let i = 0; i < this.boards.length; i++) {
   this.boards[i].draw();
  }
 }
 
 createNewBoard(board) {
  const { title, pickedColor: color, desc } = board;
  const newBoard = new Board(title, color, desc, this.boards.length, null);
  newBoard.init();
  this.boards.push(newBoard);
  this.drawBoards();
 }
 
 swapBoards(i, j) {
  [this.boards[i], this.boards[j]] = [this.boards[j], this.boards[i]];
 }
}

export default Kanban;
