import { Board } from "./Board.js";
export class UltimateBoard extends Board {
    constructor(size, parentElement, game) {
        super(size, parentElement, game);
        this.miniBoards = [];
        this.currentBoardIndex = null;
        this.preActiveBoardIndex = null; // 追加: 前回アクティブ(赤く表示)だったボードのindexを追跡するため
        this.miniBoardResult = Array(size * size).fill('');
        this.parentElement = document.querySelector('.ultimate__board__container');
        this.boundHover = this.ultimateEventMouseHover.bind(this);
        this.boundLeave = this.ultimateEventMouseLeave.bind(this);
        this.createUltimateBoards(size, parentElement, game);
        this.ultimateAddClickHandlers();
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
            parentElement.appendChild(miniBoardElement);
            const miniBoard = new Board(size, miniBoardElement, game);
            miniBoard.cells.forEach((cell, i) => {
                cell.element.classList.remove('board__container__cell');
                cell.element.classList.add('ultimate__mini-board-cell');
                // 追加: mouseover&mouseleave イベントを追加　現在のホバーしているセルと同じindexのボードをグレースケールで表示
                cell.element.addEventListener("mouseover", () => {
                    this.miniBoards[i].cells.forEach((cell) => {
                        cell.element.classList.add('next');
                    });
                });
                cell.element.addEventListener("mouseleave", () => {
                    this.miniBoards[i].cells.forEach((cell) => {
                        cell.element.classList.remove('next');
                    });
                });
            }); ////////////////////////////////////////////////////////////
            this.miniBoards.push(miniBoard);
        }
    }
    // セルにマーク
    ultimateMarkCell(boardIndex, cellIndex, mark) {
        this.miniBoards[boardIndex].markCell(cellIndex, mark);
        // セルがマークされた後、そのセルのindexと同じボードが制覇されていない場合、セルを赤く表示しアクティブボードにする
        if (this.miniBoardResult[cellIndex] === '') {
            this.miniBoards[cellIndex].cells.forEach(cell => {
                cell.element.classList.add('active');
                cell.element.addEventListener("mouseover", this.ultimateEventMouseHover);
                cell.element.addEventListener("mouseleave", this.ultimateEventMouseLeave);
            });
        }
        // 前回アクティブだったボードが存在し、preアクティブと次のボードのindexが同じではない場合、preアクティブボードとホバーイベントを解除する
        if (this.preActiveBoardIndex != null && this.preActiveBoardIndex !== cellIndex) {
            this.miniBoards[this.preActiveBoardIndex].cells.forEach(cell => {
                cell.element.classList.remove('active');
                cell.element.removeEventListener('mouseover', this.ultimateEventMouseHover);
                cell.element.removeEventListener('mouseleave', this.ultimateEventMouseLeave);
            });
        }
        this.preActiveBoardIndex = cellIndex;
    }
    // アルティメットの勝利判定
    ultimateCheckWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                const mark = this.miniBoardResult[index];
                const firstMark = this.miniBoardResult[combination[0]];
                return mark === firstMark && mark !== '';
            });
        });
    }
    // 引き分け判定
    ultimateCheckDraw() {
        return this.miniBoardResult.every(mark => mark !== '');
    }
    // セルにクリックイベントの付与
    ultimateAddClickHandlers() {
        this.miniBoards.forEach((miniBoard, boardIndex) => {
            miniBoard.cells.forEach((cell, cellIndex) => {
                if (cell.clickHandler) {
                    cell.element.removeEventListener('click', cell.clickHandler);
                }
                const clickHandler = (event) => {
                    this.ultimateHandleCellClick(cellIndex, boardIndex);
                };
                cell.element.addEventListener('click', clickHandler);
                cell.clickHandler = clickHandler;
            });
        });
    }
    // セルにマークした後のミニボードの選択
    ultimateHandleCellClick(cellIndex, boardIndex) {
        if (this.currentBoardIndex !== null && this.currentBoardIndex !== boardIndex) {
            alert("違うボードだよ"); // 後でミニボードの色を変化させて実装
            return;
        }
        if (this.miniBoardResult[boardIndex]) {
            alert("勝敗のついているボードだよ"); // 後で実装
            return;
        }
        if (!this.cells[cellIndex].mark
            && !this.ultimateCheckWin()
            && !this.ultimateCheckDraw()
            && !this.miniBoardResult[boardIndex]) {
            this.ultimateMarkCell(boardIndex, cellIndex, this.game.currentPlayer.mark);
            if (this.miniBoards[boardIndex].checkWin()) {
                // 追加: ボードのCSSクラス大きいXとOを表示させる
                if (this.game.currentPlayer.mark === 'X') {
                    this.miniBoards[boardIndex].miniBoard.classList.add('wonX');
                    this.miniBoards[boardIndex].miniBoard.setAttribute('data-winner', 'X');
                }
                else {
                    this.miniBoards[boardIndex].miniBoard.classList.add('wonO');
                    this.miniBoards[boardIndex].miniBoard.setAttribute('data-winner', 'O');
                }
                this.removeActiveUltimateBoard(); // 追加
                ///////////////////////////////////////////
                this.miniBoardResult[boardIndex] = this.game.currentPlayer.mark;
                this.currentBoardIndex = null; // 勝った人は次のボードを好きに選べる
                this.ultimateHandleEndGame(false);
                if (this.ultimateCheckWin()) {
                    alert(`${this.game.currentPlayer.name}'s Win!`); // 後で実装
                }
            }
            else if (this.ultimateCheckDraw()) {
                this.ultimateHandleEndGame(true);
            }
            else if (this.miniBoardResult) {
                if (!this.miniBoardResult[cellIndex]) {
                    this.currentBoardIndex = cellIndex;
                }
                else {
                    this.currentBoardIndex = null;
                }
                this.game.switchPlayer();
                this.game.winningMessageTextElement.innerText = `${this.game.currentPlayer.name}'s Turn`;
            }
        }
        this.game.saveGameStorage();
    }
    // ボードをクリアする
    clearUltimateBoard() {
        this.miniBoards.forEach(miniBoard => miniBoard.clearBoard());
        this.currentBoardIndex = null;
        this.ultimateAddClickHandlers();
        this.removeActiveUltimateBoard(); // 追加 ////////////////////////
        this.removeLargeXOonUltimateBoard(); // 追加
    }
    // セルがマウスホバーされたときセルを赤く表示(アクティブ)する
    ultimateEventMouseHover(event) {
        // const cellElement = event.target;
        // cellElement.classList.add('active');
        // cellElement.classList.remove('next');
        event.target.classList.remove('next');
        event.target.classList.add('active');
    }
    // セルがホバーされたときセルのアクティブを解除する
    ultimateEventMouseLeave(event) {
        // const cellElement = event.target;
        // cellElement.classList.add('next');
        // cellElement.classList.remove('active');
        event.target.classList.remove('active');
        event.target.classList.add('next');
    }
    //　前回アクティブだったボードとマウスホバーイベントを解除する(CSSのホバーは残る)
    removeActiveUltimateBoard() {
        if (this.preActiveBoardIndex !== null && this.miniBoards[this.preActiveBoardIndex]) {
            this.miniBoards[this.preActiveBoardIndex].cells.forEach(cell => {
                cell.element.classList.remove('active');
                cell.element.removeEventListener("mouseover", this.boundHover);
                cell.element.removeEventListener("mouseleave", this.boundLeave);
            });
        }
    }
    // ゲームリセットやコンテニュー時に大きいX,OをボードのCSSクラスから削除
    removeLargeXOonUltimateBoard() {
        this.miniBoards.forEach((board) => {
            if (board.miniBoard.classList.contains('wonO')) {
                board.miniBoard.classList.remove('wonO');
                board.miniBoard.removeAttribute('data-winner');
            }
            else if (board.miniBoard.classList.contains('wonX')) {
                board.miniBoard.classList.remove('wonX');
                board.miniBoard.removeAttribute('data-winner');
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    // アルティメットボードだった場合の旗を立てる
    ultimateHandleEndGame(draw) {
        this.game.handleEndGame(draw, true);
    }
    // localStorageからボードの状態を取得
    getUltimateBoardState() {
        return this.miniBoards.map(miniBoard => miniBoard.getBoardState());
    }
    // ボードの状態を復元
    setUltimateBoardState(boards) {
        boards.forEach((miniBoardState, boardIndex) => {
            this.miniBoards[boardIndex].setBoardState(miniBoardState);
        });
        this.ultimateAddClickHandlers();
    }
    // ゲッター
    get getCurrentBoardIndex() {
        return this.currentBoardIndex;
    }
}
