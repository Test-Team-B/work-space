import { Board } from "./Board.js"

export class Game {
    private _players: { [key: string]: { name: string, mark: string, isCPU: boolean } };
    private _currentPlayer: { name: string, mark: string, isCPU: boolean };
    private _isCPUThinking: boolean = false;
    private _board: Board;
    private _scores: { [key: string]: number };
    private _winningMessageTextElement: HTMLElement;

    constructor(playerXName: string, playerOName: string, boardSize: number, isCPUOpponent: boolean = false) {
        this._players = {
            'X': { name: playerXName, mark: 'X', isCPU: false },
            'O': { name: playerOName, mark: 'O', isCPU: isCPUOpponent }
        }
        this._currentPlayer = this._players['X'];
        this._board = new Board(boardSize, undefined, this);
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._winningMessageTextElement = document.getElementById('info__message')!;
        this.updateScoreBoardNames();
        const boardContainer = document.querySelector('.board__container');
        if (boardContainer instanceof HTMLElement) {
            this._board = new Board(boardSize, boardContainer, this);
        } else {
            throw new Error("Board container element not found");
        }
    }


    // ゲームを初期化
    public initializeGame(): void {
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        this.loadGameStorage();
        this._board.addClickHandlers();
        this.updateScores();
    }
    
    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    public continueGame(): void {
        this.initializeGame();
        this._board.clearBoard();
    }

    // スコアをリセット
    private resetScores(): void {
        this._scores = {
            'X': 0,
            'O': 0
        };
    }

    // ゲームをリスタート
    public resetGame(): void {
        this._board.clearBoard();
        this.resetScores();
        this.initializeGame();
    }

    // プレイヤー交代
    public switchPlayer(): void {
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        }
    }

    
    private playCPUTurn(): void {
        this._isCPUThinking = true;
        setTimeout(() => {
            const emptyCells = this._board.cells.filter(cell => !cell.mark);
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const cellIndex = this._board.cells.indexOf(randomCell);
                this._board.markCell(cellIndex, this._currentPlayer.mark);
                if (this.checkWin()) {
                    this.handleEndGame(false);
                } else if (this.checkDraw()) {
                    this.handleEndGame(true);
                } else {
                    this.switchPlayer();
                    this.winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
                }
                this.saveGameStorage();
                this._isCPUThinking = false;
            }
        }, 1000);
    }
    
    // ゲーム結果の表示、スコアの更新
    public handleEndGame(draw: boolean): void {
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        } else {
            this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            this._scores[this._currentPlayer.mark]++;
            this.updateScores();
        }
    }
    
    // スコアボードの更新
    public updateScores(): void {
        document.getElementById('scoreboard__X__score')!.innerText = `${this._scores['X']}`;
        document.getElementById('scoreboard__O__score')!.innerText = `${this._scores['O']}`;
    }
    
    // スコアボードの名前を更新
    private updateScoreBoardNames(): void {
        document.getElementById('scoreboard__X__name')!.innerText = this._players['X'].name;
        document.getElementById('scoreboard__O__name')!.innerText = this._players['O'].name;
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
        return this._winningMessageTextElement
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
            board: this._board.getBoardState()
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
            this._board.setBoardState(state.board);
        }
    }
}
