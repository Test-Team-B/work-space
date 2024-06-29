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

    constructor(playerXName: string, playerOName: string, boardSize: number, isCPUOpponent: boolean = false, ultimateBoard: boolean = false) {
        this._players = {
            'X': { name: playerXName, mark: 'X', isCPU: false },
            'O': { name: playerOName, mark: 'O', isCPU: isCPUOpponent }
        }
        this._currentPlayer = this._players['X'];
        this._board = ultimateBoard ? new Board(boardSize, undefined, this) : new UltimateBoard(boardSize, undefined, this);
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._winningMessageTextElement = document.getElementById('info__message')!;
        this._ultimateWinningMessageTextElement = document.getElementById('ultimate-info__message')!;

        const boardContainer = document.querySelector('.board__container') as HTMLElement;
        const ultimateBoardContainer = document.querySelector('.ultimate__board__container') as HTMLElement;
        if (ultimateBoard) {
            this._board = new UltimateBoard(boardSize, ultimateBoardContainer, this);
        } else {
            this._board = new Board(boardSize, boardContainer, this);
        }

        this.updateScoreBoardNames();
    }

    // ゲームを初期化
    public initializeGame(): void {
        console.log("initialize!!!")
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        // this.loadGameStorage();
        if (this._board instanceof UltimateBoard) {
            this._board.clearUltimateBoard();
            console.log("イニシャライズ・クリアボード")
        } else {
            this._board.clearBoard();
        }
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
        console.log("スウィッチ")
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            console.log("CPU's turn");
            this.playCPUTurn();
        } else {
            console.log("Human's turn");
        }
    }

    public playCPUTurn(): void {
        console.log("プレイCPU")
        this._isCPUThinking = true;
        setTimeout(() => {
            let emptyCells: { boardIndex: number, cellIndex: number, cell: { mark: string, element: HTMLElement }}[] = [];

            console.log("エンプティセルず")
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
                    console.log("アルティメットマーク")
                    this._board.ultimateMarkCell(boardIndex, cellIndex, this._currentPlayer.mark);
                    console.log("アルティメットマークセルしたよ")
                } else {
                    this._board.markCell(cellIndex, this._currentPlayer.mark);
                }

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
        console.log("ハンドエンド")
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        } else {
            this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            this._scores[this._currentPlayer.mark]++;
            this.updateScores();
        }
        console.log("ウィニングメッセージ")
        console.log(this.winningMessageTextElement)
    }
    
    // スコアボードの更新
    public updateScores(): void {
        console.log("スコアボードの更新")
        if (this.board instanceof UltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-score')!.innerText = `${this._scores['X']}`;
            document.getElementById('ultimate-scoreboard__O-score')!.innerText = `${this._scores['O']}`;
        } else {
            document.getElementById('scoreboard__X__score')!.innerText = `${this._scores['X']}`;
            document.getElementById('scoreboard__O__score')!.innerText = `${this._scores['O']}`;
        }
    }
    
    // スコアボードの名前を更新
    private updateScoreBoardNames(): void {
        console.log("スコアボードの名前の更新")
        if (this.board instanceof UltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-name')!.innerText = this._players['X'].name;
            document.getElementById('ultimate-scoreboard__O-name')!.innerText = this._players['O'].name;
        } else {
            document.getElementById('scoreboard__X__name')!.innerText = this._players['X'].name;
            document.getElementById('scoreboard__O__name')!.innerText = this._players['O'].name;
        }
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
