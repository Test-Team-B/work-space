export class Board {
    constructor(size, parentElement = document.querySelector('.board__container')) {
        this._size = size;
        this._cells = [];
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
        parentElement.innerHTML = ""; // セルのクリア
        for (let i = 0; i < this._size * this._size; i++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('board__container__cell');
            cellElement.dataset.ceeIndex = i.toString();
            parentElement.appendChild(cellElement);
            this._cells.push({ mark: '', element: cellElement });
        }
    }
    // セルにマークをつける
    markCell(cellIndex, mark) {
        this._cells[cellIndex].mark = mark;
        this._cells[cellIndex].element.classList.add(mark);
        this._cells[cellIndex].element.textContent = mark;
    }
    // 勝者を判定する
    // 勝者条件のどれかの配列(some)、マークが存在し全て同じ(every)
    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this._cells[index].mark === this._cells[combination[0]].mark && this._cells[index].mark !== '';
            });
        });
    }
    // 全てのセルが空ではない(every)
    checkDraw() {
        return this._cells.every(_cell => _cell.mark !== '');
    }
    // クリックイベントの付与
    addClickHandlers(game) {
        this._cells.forEach((cell, index) => {
            cell.element.addEventListener('click', () => {
                let mouseclick = new Audio();
                mouseclick.src = "https://uploads.sitepoint.com/wp-content/uploads/2023/06/1687569402mixkit-fast-double-click-on-mouse-275.wav";
                mouseclick.play();
                if (!cell.mark && !game.checkWin() && !game.checkDraw()) {
                    game.board.markCell(index, game.currentPlayer.mark);
                    if (game.checkWin()) {
                        game.handleEndGame(false);
                    }
                    else if (game.checkDraw()) {
                        game.handleEndGame(true);
                    }
                    else {
                        game.switchPlayer();
                        game.winningMessageTextElement.innerText = `${game._currentPlayer.name}'s Turn`;
                    }
                }
            }, { once: true }); // １度目のクリックだけにイベントが発生するように設定
        });
    }
    // ボードをクリアする
    clearBoard() {
        this._cells.forEach(cell => {
            cell.mark = '';
            cell.element.classList.remove('X', 'O');
            cell.element.textContent = '';
        });
    }
    // ゲッター
    get cells() {
        return this._cells;
    }
    get size() {
        return this._size;
    }
}
