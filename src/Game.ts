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
        console.log("アルティメットかノーマルか")
        this._board = ultimateBoard
            ? new UltimateBoard(boardSize, ultimateBoardContainer, this)
            : new Board(boardSize, boardContainer, this);

        this.updateScoreBoardNames(ultimateBoard);
    }

    // ゲームを初期化
    public initializeGame(): void {
        console.log("initialize!!!")
        // @audit
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        // this.loadGameStorage();
        if (this._board instanceof UltimateBoard) {
            console.log("アルティメットクリアボード")
            this._board.clearUltimateBoard();
        } else {
            console.log("ノーマルクリアボード")
            this._board.clearBoard();
        }
        this.updateScores(this.ultimateMode);
    }

    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    public continueGame(): void {
        this.initializeGame();
    }

    // ゲームをリスタート
    public resetGame(): void {
        this.resetScores();
        this.initializeGame();
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

            if (this._board instanceof UltimateBoard) {
                console.log("アルティメットCPU")
                const boardIndex = this._board.currentBoardIndex !== null ? this._board.currentBoardIndex : Math.floor(Math.random() * this._board.miniBoards.length);
                this._board.miniBoards[boardIndex].cells.forEach((cell, cellIndex) => {
                    if (!cell.mark) {
                        emptyCells.push({ boardIndex, cellIndex, cell });
                    }
                });
            } else {
                console.log("ノーマルボードCPU")
                emptyCells = this._board.cells
                    .map((cell, index) => ({ boardIndex: 0, cellIndex: index, cell}))
                    .filter(({ cell }) => !cell.mark);
            }

            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const { boardIndex, cellIndex } = randomCell;

                if (this._board instanceof UltimateBoard) {
                    this._board.ultimateMarkCell(boardIndex, cellIndex, this._currentPlayer.mark);
                    console.log("アルティメットマークセルしたよ")
                } else {
                    console.log("ノーマルマークしたよ")
                    this._board.markCell(cellIndex, this._currentPlayer.mark);
                }

                if (this.checkWin()) {
                    this.handleEndGame(false);
                } else if (this.checkDraw()) {
                    this.handleEndGame(true);
                } else {
                    this.switchPlayer();
                    // @audit fixed
                    this.winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
                }
                this.saveGameStorage();
                this._isCPUThinking = false;
            }
        }, 1000);
    }
    
    // ゲーム結果の表示、スコアの更新
    public handleEndGame(draw: boolean, isUltimateBoard: boolean = false): void {
        console.log("ハンドエンド")
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        } else {
            this._scores[this._currentPlayer.mark]++;
            this.updateScores(isUltimateBoard);
            if (!isUltimateBoard) {
                console.log("ミニボードで勝ったよ！！")
                this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            }
        }
    }
    
    // スコアボードの更新
    public updateScores(isUltimateBoard: boolean = false): void {
        console.log("スコアボードの更新")
        
        if (isUltimateBoard) {
            console.log("アルティメット・スコアボード")
            document.getElementById('ultimate-scoreboard__X-score')!.innerText = `${this._scores['X']}`;
            document.getElementById('ultimate-scoreboard__O-score')!.innerText = `${this._scores['O']}`;
        } else {
            document.getElementById('scoreboard__X__score')!.innerText = `${this._scores['X']}`;
            document.getElementById('scoreboard__O__score')!.innerText = `${this._scores['O']}`;
        }
        console.log("__________________________終わり")
    }
    
    // スコアボードの名前を初期化
    private updateScoreBoardNames(isUltimateBoard: boolean = false): void {
        console.log("スコアボードの名前の更新")
        if (isUltimateBoard) {
            console.log("アルティメット・ボードネーム")
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
