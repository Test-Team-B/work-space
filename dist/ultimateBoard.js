import { Board } from "./Board.js";
export class UltimateBoard extends Board {
    constructor(size, parentElement = document.querySelector('#ultimate__board'), game) {
        super(size, parentElement, game);
        this.miniBoards = [];
        this.createUltimateBoards(size, parentElement, game);
    }
    // ultimateBoard の作成、miniBoardをsize個生成し ultimateBoardの grid に当てはめる
    createUltimateBoards(size, parentElement, game) {
        parentElement.innerHTML = ''; // 親要素の中身を空に初期化
        parentElement.style.display = 'grid';
        parentElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const miniBoardElement = document.createElement('div');
            miniBoardElement.classList.add('ultimate__mini-board__container');
            miniBoardElement.dataset.ceeIndex = i.toString();
            parentElement.appendChild(miniBoardElement);
            const miniBoard = new Board(size, miniBoardElement, game);
            miniBoard.cells.forEach(cell => {
                cell.element.classList.remove('board__container__cell');
                cell.element.classList.add('ultimate__mini-board-cell');
            });
            this.miniBoards.push(miniBoard);
            console.log(this.miniBoards);
        }
    }
    ultimateMarkCell(boardIndex, cellIndex, mark) {
        this.miniBoards[boardIndex].markCell(cellIndex, mark);
    }
    // ultimateBoardの勝者判定
    ultimateCheckWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(boardIndex => {
                return this.miniBoards[boardIndex].checkWin();
            });
        });
    }
    ultimateCheckDraw() {
        return this.miniBoards.every(miniBoard => miniBoard.checkDraw());
    }
    ultimateAddClickHandlers() {
        this.miniBoards.forEach((miniBoard, boardIndex) => {
            // セルの要素からクリックイベントリスナーを削除
            this.miniBoards[boardIndex].cells.forEach((cell, cellIndex) => {
                if (cell.clickHandler) {
                    cell.element.removeEventListener('click', cell.clickHandler);
                }
                const clickHandler = (event) => {
                    if (!cell.mark && !this.game.checkWin() && !this.game.checkDraw() && !this.game.isCPUThinking) {
                        this.game.board.markCell(cellIndex, this.game.currentPlayer.mark);
                        if (this.game.checkWin()) {
                            this.game.handleEndGame(false);
                        }
                        else if (this.game.checkDraw()) {
                            this.game.handleEndGame(true);
                        }
                        else {
                            this.game.switchPlayer();
                            this.game.winningMessageTextElement.innerText = `${this.game.currentPlayer.name}'s Turn`;
                        }
                        this.game.saveGameStorage();
                    }
                };
                // イベントリスナーを再度追加
                cell.element.addEventListener('click', clickHandler);
                cell.clickHandler = clickHandler;
            });
        });
    }
    ultimateClearBoard() {
        this.miniBoards.forEach(miniBoard => miniBoard.clearBoard());
    }
    getUltimateBoardState() {
        return this.miniBoards.map(miniBoard => miniBoard.getBoardState());
    }
    setUltimateBoardState(state) {
        state.forEach((miniBoardState, boardIndex) => {
            this.miniBoards[boardIndex].setBoardState(miniBoardState);
        });
    }
}
