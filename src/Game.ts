import { Board } from "./Board.js"
import { UltimateBoard } from "./ultimateBoard.js"

export class Game {
    private _players: { [key: string]: { name: string, mark: string, isCPU: boolean } };
    private _currentPlayer: { name: string, mark: string, isCPU: boolean };
    private _isCPUThinking: boolean = false;
    private _board: Board | UltimateBoard;
    private _scores: { [key: string]: number };
    private _winningMessageTextElement: HTMLElement;
    private _ultimateWinningMessageTextElement: HTMLElement;
    private ultimateMode: boolean;

    constructor(playerXName: string, playerOName: string, boardSize: number, isCPUOpponent: boolean = false, ultimateBoard: boolean = false) {
        this._players = {
            'X': { name: playerXName, mark: 'X', isCPU: false },
            'O': { name: playerOName, mark: 'O', isCPU: isCPUOpponent }
        }
        this._currentPlayer = this._players['X'];
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._winningMessageTextElement = document.getElementById('info__message')!;
        this._ultimateWinningMessageTextElement = document.getElementById('ultimate-info__message')!;

        const boardContainer = document.querySelector('.board__container') as HTMLElement;
        const ultimateBoardContainer = document.querySelector('.ultimate__board__container') as HTMLElement;

        this.ultimateMode = ultimateBoard;
        this._board = ultimateBoard
            ? new UltimateBoard(boardSize, ultimateBoardContainer, this)
            : new Board(boardSize, boardContainer, this);

        this.updateScoreBoardNames(ultimateBoard);
    }

    // ゲームを初期化
    public initializeGame(): void {
        // @audit
        this._currentPlayer = this._players['X'];
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;

        this.loadGameStorage();
        this.handleAddClick();
        this.updateScores(this.ultimateMode);
    }

    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    public continueGame(): void {
        this.initializeGame();
        this.handleClearBoard();
    }

    // ゲームをリスタート
    public resetGame(): void {
        this.resetScores();
        this.initializeGame();
        this.handleClearBoard();
    }

    // クリアボードの条件分け
    public handleClearBoard(): void {
        if (this._board instanceof UltimateBoard) {
            this._board.clearUltimateBoard();
            this._board.miniBoardResult.fill('');
        } else {
            this._board.clearBoard();
        }
    }

    // クリックイベント付与の場合分け
    public handleAddClick(): void {
        if (this._board instanceof UltimateBoard) {
            this._board.ultimateAddClickHandlers();
            this._board.miniBoardResult.fill('');
        } else {
            this._board.addClickHandlers();
        }
    }

    // スコアをリセット
    private resetScores(): void {
        this._scores = {
            'X': 0,
            'O': 0
        };
    }

    // プレイヤー交代
    public switchPlayer(): void {
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        } else {
        }
    }

    public playCPUTurn(): void {
        this._isCPUThinking = true;
        setTimeout(() => {
            let emptyCells: { boardIndex: number, cellIndex: number, cell: { mark: string, element: HTMLElement }}[] = [];

            if (this._board instanceof UltimateBoard) {
                const boardIndex = this._board.currentBoardIndex !== null ? this._board.currentBoardIndex : Math.floor(Math.random() * this._board.miniBoards.length);
                this._board.miniBoards[boardIndex].cells.forEach((cell, cellIndex) => {
                    if (!cell.mark) {
                        emptyCells.push({ boardIndex, cellIndex, cell });
                    }
                });
            } else {
                emptyCells = this._board.cells
                    .map((cell, index) => ({ boardIndex: 0, cellIndex: index, cell}))
                    .filter(({ cell }) => !cell.mark);
            }

            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const { boardIndex, cellIndex } = randomCell;

                if (this._board instanceof UltimateBoard) {
                    this._board.ultimateHandleCellClick(cellIndex, boardIndex);
                } else {
                    this._board.handleCellClick(cellIndex);
                }
                this._isCPUThinking = false;
            }
        }, 1000);
    }
    
    // ゲーム結果の表示、スコアの更新
    public handleEndGame(draw: boolean, isUltimateBoard: boolean = false): void {
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        } else {
            this._scores[this._currentPlayer.mark]++;
            this.updateScores(isUltimateBoard);
            if (!isUltimateBoard) {
                this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            }
        }
    }
    
    // スコアボードの更新
    public updateScores(isUltimateBoard: boolean = false): void {
        if (isUltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-score')!.innerText = `${this._scores['X']}`;
            document.getElementById('ultimate-scoreboard__O-score')!.innerText = `${this._scores['O']}`;
        } else {
            document.getElementById('scoreboard__X__score')!.innerText = `${this._scores['X']}`;
            document.getElementById('scoreboard__O__score')!.innerText = `${this._scores['O']}`;
        }
    }
    
    // スコアボードの名前を初期化
    private updateScoreBoardNames(isUltimateBoard: boolean = false): void {
        if (isUltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-name')!.innerText = this._players['X'].name;
            document.getElementById('ultimate-scoreboard__O-name')!.innerText = this._players['O'].name;
        } else {
            document.getElementById('scoreboard__X__name')!.innerText = this._players['X'].name;
            document.getElementById('scoreboard__O__name')!.innerText = this._players['O'].name;
        }
    }

    // 名前入力画面から名前だけ変更
    public updatePlayerNames(playerXName: string, playerOName: string): void {
        this._players['X'].name = playerXName;
        this._players['O'].name = playerOName;
        this.updateScoreBoardNames(this.ultimateMode);
    }
    
    // カプセル化、勝ち判定
    public checkWin(): boolean {
        return this._board.checkWin();
    }
    
    // カプセル化、引き分け判定
    public checkDraw(): boolean {
        return this._board.checkDraw();
    }
    
    // ゲッター
    get players() {
        return this._players;
    }

    get currentPlayer() {
        return this._currentPlayer;
    }
    
    get board() {
        return this._board;
    }
    
    get scores() {
        return this._scores;
    }
    
    get winningMessageTextElement() {
        if (this.board instanceof UltimateBoard) {
            return this._ultimateWinningMessageTextElement;
        } else {
            return this._winningMessageTextElement;
        }
    }
    
    get isCPUThinking(): boolean {
        return this._isCPUThinking;
    }

    // セッター
    set currentPlayers(player: { name: string, mark: string, isCPU: boolean }) {
        this._currentPlayer = player;
    }

    set board(board: Board) {
        this._board = board;
    }

    // localStorageに保存
    public saveGameStorage() {
        const gameState = {
            players: this._players,
            currentPlayer: this._currentPlayer,
            scores: this._scores,
            board: this._board instanceof UltimateBoard ? this._board.getUltimateBoardState() : this._board.getBoardState(),
        }
        localStorage.setItem('ticTacToeState', JSON.stringify(gameState));
    }

    // localStorageから取得
    public loadGameStorage() {
        const gameState = localStorage.getItem('ticTacToeState');
        if (gameState) {
            const state = JSON.parse(gameState);
            this._players = state.players;
            this._currentPlayer = state.currentPlayer
            this._scores = state.scores;
            
            if (this.ultimateMode) {
                const ultimateBoardContainer = document.querySelector('.ultimate__board__container') as HTMLElement;
                this._board = new UltimateBoard(this._board.size, ultimateBoardContainer, this);
                (this._board as UltimateBoard).setUltimateBoardState(state.board);
            } else {
                const boardContainer = document.querySelector('.board__container') as HTMLElement;
                this._board = new Board(this._board.size, boardContainer, this);
                this._board.setBoardState(state.board);
            }
        }
    }
}
