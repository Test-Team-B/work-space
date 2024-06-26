export class Board {
    constructor(size, parentElement = document.querySelector('.board__container'), game) {
        this._size = size;
        this._cells = [];
        this._game = game;
        this.winningCombinations = this.generateWinningCombinations(size);
        this.createCells(parentElement);
    }
    // 勝利条件を動的に実装
    generateWinningCombinations(size) {
        const combinations = [];
        // 行
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            combinations.push(row);
        }
        // 縦
        for (let i = 0; i < size; i++) {
            const col = [];
            for (let j = 0; j < size; j++) {
                col.push(j * size + i);
            }
            combinations.push(col);
        }
        // 斜め、左上から右下
        const diagonal1 = [];
        for (let i = 0; i < size; i++) {
            diagonal1.push(i * size + i);
        }
        combinations.push(diagonal1);
        // 斜め、右上から左下
        const diagonal2 = [];
        for (let i = 0; i < size; i++) {
            diagonal2.push(i * size + (size - 1 - i));
        }
        combinations.push(diagonal2);
        return combinations;
    }
    // セルを作りクラスとインデックスを付与、マークとエレメントを保持する
    createCells(parentElement) {
        parentElement.style.gridTemplateColumns = `repeat(${this._size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${this._size}, 1fr)`;
        parentElement.innerHTML = "";
        for (let i = 0; i < this._size * this._size; i++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('board__container__cell');
            parentElement.appendChild(cellElement);
            this._cells.push({ mark: '', element: cellElement });
        }
    }
    // セルにマークをつける
    markCell(cellIndex, mark) {
        const optionsClickSound = document.getElementById('click-sound');
        const mouseclick = new Audio();
        mouseclick.src = "https://uploads.sitepoint.com/wp-content/uploads/2023/06/1687569402mixkit-fast-double-click-on-mouse-275.wav";
        mouseclick.play();
        optionsClickSound.addEventListener('click', (e) => {
            mouseclick.pause();
        });
        this._cells[cellIndex].mark = mark;
        this._cells[cellIndex].element.classList.add(mark);
        this._cells[cellIndex].element.textContent = mark;
    }
    // 勝者を判定する
    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                const cellMark = this.cells[index].mark;
                const firstMark = this.cells[combination[0]].mark;
                return cellMark === firstMark && cellMark !== '';
            });
        });
    }
    // 全てのセルが空ではない
    checkDraw() {
        return this._cells.every(_cell => _cell.mark !== '');
    }
    // クリックイベントの付与
    addClickHandlers() {
        this._cells.forEach((cell, index) => {
            // セルの要素からクリックイベントリスナーを削除
            if (cell.clickHandler) {
                cell.element.removeEventListener('click', cell.clickHandler);
            }
            const clickHandler = (event) => {
                this.handleCellClick(index);
            };
            // イベントリスナーを再度追加
            cell.element.addEventListener('click', clickHandler);
            cell.clickHandler = clickHandler;
        });
    }
    // クリックイベントの内容
    handleCellClick(index) {
        if (!this._cells[index].mark && !this.checkWin() && !this.checkDraw()) {
            this.markCell(index, this.game.currentPlayer.mark);
            if (this.checkWin()) {
                this.game.handleEndGame(false);
            }
            else if (this.checkDraw()) {
                this.game.handleEndGame(true);
            }
            else {
                this.game.switchPlayer();
                // @audit fixed
                this.game.winningMessageTextElement.innerText = `${this.game.currentPlayer.name}'s Turn`;
            }
            this.game.saveGameStorage();
        }
    }
    // ボードをクリアする
    clearBoard() {
        this._cells.forEach(cell => {
            cell.mark = '';
            cell.element.classList.remove('X', 'O');
            cell.element.textContent = '';
            if (cell.clickHandler) {
                cell.element.removeEventListener('click', cell.clickHandler);
            }
        });
        this.addClickHandlers();
    }
    // ゲッター
    get cells() {
        return this._cells;
    }
    get size() {
        return this._size;
    }
    get game() {
        return this._game;
    }
    // ボードの状態の取得
    getBoardState() {
        return this._cells.map(cell => ({ mark: cell.mark }));
    }
    // ボードの状態の復元
    setBoardState(state) {
        state.forEach((cellState, index) => {
            if (cellState.mark) {
                this._cells[index].mark = cellState.mark;
                this._cells[index].element.classList.add(cellState.mark);
                this._cells[index].element.textContent = cellState.mark;
            }
        });
        this.addClickHandlers();
    }
}
