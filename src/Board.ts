import { Game } from './Game.js';

export class Board {
    private _cells: { mark: string, element: HTMLElement, clickHandler?: (event: MouseEvent) => void }[];
    private _size: number;
    private _game: Game;

    protected winningCombinations: number[][];

    constructor(size: number, parentElement: HTMLElement | null = document.querySelector('.board__container'), game: Game) {
        this._size = size;
        this._cells = [];
        this._game = game;
        this.winningCombinations = this.generateWinningCombinations(size);
        this.createCells(parentElement as HTMLElement);
    }

    // 勝利条件を動的に実装
    private generateWinningCombinations(size: number): number[][] {
        const combinations: number[][] = [];

        // 行
        for (let i = 0; i < size; i++) {
            const row: number[] = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            combinations.push(row);
        }

        // 縦
        for (let i = 0; i < size; i++) {
            const col: number[] = [];
            for (let j = 0; j < size; j++) {
                col.push(j * size + i);
            }
            combinations.push(col);
        }

        // 斜め、左上から右下
        const diagonal1: number[] = [];
        for (let i = 0; i < size; i++) {
            diagonal1.push(i * size + i);
        }
        combinations.push(diagonal1);

        // 斜め、右上から左下
        const diagonal2: number[] = [];
        for (let i = 0; i < size; i++) {
            diagonal2.push(i * size + (size - 1 - i));
        }
        combinations.push(diagonal2);

        return combinations;
    }

    // セルを作りクラスとインデックスを付与、マークとエレメントを保持する
    protected createCells(parentElement: HTMLElement): void {
        parentElement.style.gridTemplateColumns = `repeat(${this._size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${this._size}, 1fr)`;
        parentElement.innerHTML = "";

        for (let i = 0; i < this._size * this._size; i++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('board__container__cell');
            parentElement.appendChild(cellElement);

            this._cells.push({ mark: '', element: cellElement })
        }
    }

    // セルにマークをつける
    public markCell(cellIndex: number, mark: string): void {
        const optionsClickSound = document.getElementById('click-sound')!;
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
    public checkWin(): boolean {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                const cellMark = this.cells[index].mark;
                const firstMark = this.cells[combination[0]].mark;
                return cellMark === firstMark && cellMark !== '';
            });
        });
    }

    // 全てのセルが空ではない
    public checkDraw(): boolean {
        return this._cells.every(_cell => _cell.mark !== '');
    }

    // クリックイベントの付与
    public addClickHandlers(): void {
        this._cells.forEach((cell, index) => {
            // セルの要素からクリックイベントリスナーを削除
            if (cell.clickHandler) {
                cell.element.removeEventListener('click', cell.clickHandler);
            }
            const clickHandler = (event: MouseEvent) => {
                this.handleCellClick(index);
            };
            // イベントリスナーを再度追加
            cell.element.addEventListener('click', clickHandler);
            cell.clickHandler = clickHandler;
        })
    }

    // クリックイベントの内容
    public handleCellClick(index: number): void {
        if (!this._cells[index].mark && !this.checkWin() && !this.checkDraw()) {
            this.markCell(index, this.game.currentPlayer.mark);
            if (this.checkWin()) {
                this.game.handleEndGame(false);
            } else if (this.checkDraw()) {
                this.game.handleEndGame(true)
            } else {
                this.game.switchPlayer();
                // @audit fixed
                this.game.winningMessageTextElement.innerText = `${this.game.currentPlayer.name}'s Turn`;
            }
            this.game.saveGameStorage();
        }
    }

    // ボードをクリアする
    public clearBoard(): void {
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
    public getBoardState(): { mark: string }[] {
        return this._cells.map(cell => ({ mark: cell.mark }));
    }

    // ボードの状態の復元
    public setBoardState(state: { mark: string }[]): void {
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