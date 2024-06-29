import { Board } from "./Board.js";
export class UltimateBoard extends Board {
    constructor(size, parentElement = document.querySelector('#ultimate__board'), game) {
        super(size, parentElement, game);
        this.miniBoards = [];
        this.currentBoardIndex = null;
        this.createUltimateBoards(size, parentElement, game);
        this.clearUltimateBoard();
    }
    // ultimateBoard の作成、miniBoardをsize個生成し ultimateBoardの grid に当てはめる
    createUltimateBoards(size, parentElement, game) {
        parentElement.innerHTML = '';
        parentElement.style.display = 'grid';
        parentElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const miniBoardElement = document.createElement('div');
            miniBoardElement.classList.add('ultimate__mini-board__container');
            miniBoardElement.dataset.cellIndex = i.toString();
            parentElement.appendChild(miniBoardElement);
            const miniBoard = new Board(size, miniBoardElement, game);
            miniBoard.cells.forEach(cell => {
                cell.element.classList.remove('board__container__cell');
                cell.element.classList.add('ultimate__mini-board-cell');
            });
            this.miniBoards.push(miniBoard);
        }
    }
    ultimateMarkCell(boardIndex, cellIndex, mark) {
        console.log("アルティメットマークセル");
        this.miniBoards[boardIndex].markCell(cellIndex, mark);
        console.log(this.miniBoards);
        this.currentBoardIndex = cellIndex;
    }
    // ultimateBoardの勝者判定
    ultimateCheckWin() {
        console.log("アルティメット・ウィン");
        if (this.currentBoardIndex !== null && this.currentBoardIndex >= 0) {
            // 指定されたミニボードの勝利条件をチェック
            console.log("今のボード");
            console.log(this.currentBoardIndex);
            console.log(this.miniBoards[this.currentBoardIndex].checkWin());
            return this.miniBoards[this.currentBoardIndex].checkWin();
        }
        else {
            return false;
        }
        ;
    }
    ultimateCheckDraw() {
        console.log("アルティメットドロー");
        if (this.currentBoardIndex !== null && this.currentBoardIndex >= 0) {
            // 指定されたミニボードの引き分け条件をチェック
            return this.miniBoards[this.currentBoardIndex].checkDraw();
        }
        else {
            return false;
        }
    }
    ultimateAddClickHandlers() {
        console.log("アルティメット・アドクリック");
        this.miniBoards.forEach((miniBoard, boardIndex) => {
            miniBoard.cells.forEach((cell, cellIndex) => {
                // セルの要素からクリックイベントリスナーを削除
                if (cell.clickHandler) {
                    cell.element.removeEventListener('click', cell.clickHandler);
                }
                const clickHandler = (event) => {
                    // 現在のボードではない時クリックしても反応しない
                    if (this.currentBoardIndex !== null && this.currentBoardIndex !== boardIndex) {
                        return;
                    }
                    console.log("クリックハンドラー");
                    if (!cell.mark && !this.ultimateCheckWin() && !this.ultimateCheckDraw() && !this.game.isCPUThinking) {
                        console.log("アルティメットハンドラー");
                        this.ultimateMarkCell(boardIndex, cellIndex, this.game.currentPlayer.mark);
                        this.game.saveGameStorage();
                        if (this.ultimateCheckWin()) {
                            this.game.handleEndGame(false);
                        }
                        else if (this.ultimateCheckDraw()) {
                            this.game.handleEndGame(true);
                        }
                        else {
                            console.log("アルティメットスウィッチ");
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
    get getCurrentBoardIndex() {
        return this.currentBoardIndex;
    }
    // ボードをクリアする
    clearUltimateBoard() {
        console.log("アルティメット・クリアボード");
        this.miniBoards.forEach(miniBoard => miniBoard.clearBoard());
        this.currentBoardIndex = null;
        this.ultimateAddClickHandlers();
    }
}