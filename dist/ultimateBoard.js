import { Board } from "./Board.js";
class ultimateBoard extends Board {
    constructor(size, parentElement = document.querySelector('#ultimate__board'), game) {
        super(size, parentElement, game);
        this.miniBoards = [];
        this.createUltimateBoards(size, parentElement);
    }
    // ultimateBoard の作成、miniBoardをsize個生成し ultimateBoardの grid に当てはめる
    createUltimateBoards(size, parentElement) {
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
            miniBoard.cells.forEach((cell, cellIndex) => {
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
