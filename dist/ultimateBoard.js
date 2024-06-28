import { Board } from "./Board.js";
class ultimateBoard extends Board {
    constructor(size, parentElement = document.querySelector('#ultimate__board'), game) {
        super(size, parentElement, game);
        this.miniBoards = this.createMiniBoards(size, parentElement);
    }
    createMiniBoards(size, parentElement) {
        parentElement.innerHTML = ''; // 親要素の中身を空に初期化
        parentElement.style.display = 'grid';
        parentElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const miniBoardElement = document.createElement('div');
            miniBoardElement.classList.add('ultimateBoard__container__cell');
            miniBoardElement.dataset.ceeIndex = i.toString();
            parentElement.appendChild(miniBoardElement);
            this.miniBoards.push(new Board(size, miniBoardElement, this.miniBoards[i].game));
        }
    }
    markCell(cellIndex, mark) {
    }
    checkWin() {
    }
    checkDraw() {
    }
    addClickHandlers(game) {
    }
    clearBoard() {
    }
    getBoardState() {
    }
    setBoardState(state) {
    }
}
