import { Game } from './Game.js';
import { Board } from "./Board.js"

export class UltimateBoard extends Board {
    public miniBoards: Board[];
    public currentBoardIndex: number | null;
    public miniBoardResult: string[];
    public parentElement: HTMLElement;

    constructor(size: number, parentElement: HTMLElement, game: Game) {
        super(size, parentElement, game);
        this.miniBoards = [];
        this.currentBoardIndex = null;
        this.miniBoardResult = Array(size * size).fill('');
        this.parentElement  = document.querySelector('.ultimate__board__container') as HTMLElement;
        this.createUltimateBoards(size, parentElement, game);

    }

    // ultimateBoard の作成、miniBoardをsize個生成し ultimateBoardの grid に当てはめる
    private createUltimateBoards(size: number, parentElement: HTMLElement, game: Game): void {
        parentElement.innerHTML = '';
        parentElement.style.display = 'grid';
        parentElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        for (let i = 0; i < size * size; i++) {
            const miniBoardElement = document.createElement('div');
            miniBoardElement.classList.add('ultimate__mini-board__container');
            parentElement.appendChild(miniBoardElement);

            const miniBoard = new Board(size, miniBoardElement, game)
            miniBoard.cells.forEach(cell => {
                cell.element.classList.remove('board__container__cell');
                cell.element.classList.add('ultimate__mini-board-cell');
            });

            this.miniBoards.push(miniBoard);
        }
    }
    
    public ultimateMarkCell(boardIndex: number, cellIndex: number, mark: string): void {
        this.miniBoards[boardIndex].markCell(cellIndex, mark);
    }

    public ultimateCheckWin(): boolean {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                const mark = this.miniBoardResult[index];
                const firstMark = this.miniBoardResult[combination[0]];
                return mark === firstMark && mark !== '';
            });
        });
    }

    public ultimateCheckDraw(): boolean {
        return this.miniBoardResult.every(mark => mark !== '');
    }

    public ultimateAddClickHandlers(): void {
        this.miniBoards.forEach((miniBoard, boardIndex) => {
            miniBoard.cells.forEach((cell, cellIndex) => {
                // セルの要素からクリックイベントリスナーを削除
                if (cell.clickHandler) {
                    cell.element.removeEventListener('click', cell.clickHandler);
                }

                const clickHandler = (event: MouseEvent) => {
                    // 現在のボードではない時クリックしても反応しない
                    this.ultimateHandleCellClick(cellIndex, boardIndex)
                }
                // イベントリスナーを再度追加
                cell.element.addEventListener('click', clickHandler);
                cell.clickHandler = clickHandler;
            });
        });
    }

    public ultimateHandleCellClick(cellIndex: number, boardIndex: number) {
        if (this.currentBoardIndex !== null && this.currentBoardIndex !== boardIndex) {
            alert("違うボードだよ");    // 後でミニボードの色を変化させて実装
            return;
        }
        if (this.miniBoardResult[boardIndex]) {
            alert("勝敗のついているボードだよ");    // 後で実装
            return;
        }
        
        if (!this.cells[cellIndex].mark
            && !this.ultimateCheckWin()
            && !this.ultimateCheckDraw()
            && !this.miniBoardResult[boardIndex]) {
            this.ultimateMarkCell(boardIndex, cellIndex, this.game.currentPlayer.mark);

            if (this.miniBoards[boardIndex].checkWin()) {
                this.miniBoardResult[boardIndex] = this.game.currentPlayer.mark;
                this.currentBoardIndex = null;  // 勝った人は次のボードを好きに選べる
                this.ultimateHandleEndGame(false);

                if (this.ultimateCheckWin()) {
                    alert(`${this.game.currentPlayer.name}'s Win!`);    // 後で実装
            }
            } else if (this.ultimateCheckDraw()) {
                this.ultimateHandleEndGame(true);
            } else if (this.miniBoardResult) {
                if (!this.miniBoardResult[cellIndex]) {
                    this.currentBoardIndex = cellIndex;
                }
                else {
                    this.currentBoardIndex = null;
                }
                this.game.switchPlayer();
                this.game.winningMessageTextElement.innerText = `${this.game.currentPlayer.name}'s Turn`;
            }
            this.game.saveGameStorage();
        }
    }

    // アルティメットボードだった場合の旗を立てる
    private ultimateHandleEndGame(draw: boolean): void {
        this.game.handleEndGame(draw, true);
    }

    get getCurrentBoardIndex(): number | null {
        return this.currentBoardIndex;
    }

    // ボードをクリアする
    public clearUltimateBoard(): void {
        this.miniBoards.forEach(miniBoard => miniBoard.clearBoard());
        this.currentBoardIndex = null;
        this.ultimateAddClickHandlers();
    }
    
    // localStorage
    public getUltimateBoardState(): { mark: string }[][] {
        return this.miniBoards.map(miniBoard => miniBoard.getBoardState());
    }

    public setUltimateBoardState(state: { mark: string }[][]): void {
        state.forEach((miniBoardState, boardIndex) => {
            this.miniBoards[boardIndex].setBoardState(miniBoardState);
        });
        this.ultimateAddClickHandlers();
    }
}
