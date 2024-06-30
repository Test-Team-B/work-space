import { Game } from './Game.js';
import { Board } from "./Board.js"

export class UltimateBoard extends Board {
    public miniBoards: Board[];
    public currentBoardIndex: number | null;

    constructor(size: number, parentElement: HTMLElement = document.querySelector('.ultimate__board__container')!, game: Game) {
        super(size, parentElement, game);
        this.miniBoards = [];
        this.currentBoardIndex = null;

        console.log("アルティメットが呼ばれました")
        this.createUltimateBoards(size, parentElement, game);
    }

    // ultimateBoard の作成、miniBoardをsize個生成し ultimateBoardの grid に当てはめる
    private createUltimateBoards(size: number, parentElement: HTMLElement, game: Game): void {
        console.log("アルティメットセルを作るよ")
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
        console.log("アルティメットマークセル")
        this.miniBoards[boardIndex].markCell(cellIndex, mark);
    }

    // ultimateBoardの勝者判定
    public ultimateCheckWin(): boolean {
        console.log("アルティメット・ウィン")
        if (this.currentBoardIndex !== null && this.currentBoardIndex >= 0) {
            // 指定されたミニボードの勝利条件をチェック
            return this.miniBoards[this.currentBoardIndex].checkWin();
        } else {
            return false;
            };
    }


    public ultimateCheckDraw(): boolean {
        console.log("アルティメットドロー")
        if (this.currentBoardIndex !== null && this.currentBoardIndex >= 0) {
            // 指定されたミニボードの引き分け条件をチェック
            return this.miniBoards[this.currentBoardIndex].checkDraw();
        } else {
            return false;
        }
    }

    public ultimateAddClickHandlers(): void {
        console.log("アルティメット・アドクリック")
        this.miniBoards.forEach((miniBoard, boardIndex) => {
            miniBoard.cells.forEach((cell, cellIndex) => {
                // セルの要素からクリックイベントリスナーを削除
                if (cell.clickHandler) {
                    cell.element.removeEventListener('click', cell.clickHandler);
                }

                const clickHandler = (event: MouseEvent) => {
                    // 現在のボードではない時クリックしても反応しない
                    if (this.currentBoardIndex !== null && this.currentBoardIndex !== boardIndex) {
                        console.log("違うボードだよ")
                        return;
                    }

                    if (!cell.mark && !this.ultimateCheckWin() && !this.ultimateCheckDraw() && !this.game.isCPUThinking) {
                        console.log("アルティメットハンドラー")
                        this.ultimateMarkCell(boardIndex, cellIndex, this.game.currentPlayer.mark);
                        // this.game.saveGameStorage();
                        if (this.ultimateCheckWin()) {
                            this.game.handleEndGame(false);
                        } else if (this.ultimateCheckDraw()) {
                            this.game.handleEndGame(true)
                        } else {
                            console.log("アルティメットスウィッチ")
                            this.currentBoardIndex = cellIndex;
                            this.game.switchPlayer();
                            this.game.winningMessageTextElement.innerText = `${this.game.currentPlayer.name}'s Turn`;
                        }
                        this.game.saveGameStorage();
                    }
                }
                // イベントリスナーを再度追加
                cell.element.addEventListener('click', clickHandler);
                cell.clickHandler = clickHandler;
            });
        });
    }

    get getCurrentBoardIndex(): number | null {
        return this.currentBoardIndex;
    }

    // ボードをクリアする
    public clearUltimateBoard(): void {
        console.log("アルティメット・クリアボード")
        this.miniBoards.forEach(miniBoard => miniBoard.clearBoard());
        this.currentBoardIndex = null;
        this.ultimateAddClickHandlers();
    }
    
    // public ultimateClearBoard(): void {
    //     this.miniBoards.forEach(miniBoard => miniBoard.clearBoard());
    // }

    // public getUltimateBoardState(): { mark: string }[][] {
    //     return this.miniBoards.map(miniBoard => miniBoard.getBoardState());
    // }

    // public setUltimateBoardState(state: { mark: string; }[][]): void {
    //     state.forEach((miniBoardState, boardIndex) => {
    //         this.miniBoards[boardIndex].setBoardState(miniBoardState);
    //     });
    // }
}
