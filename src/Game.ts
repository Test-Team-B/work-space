import { Board } from "./Board.js";
import { UltimateBoard } from "./ultimateBoard.js";

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
        };
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._currentPlayer = this._players['X'];
        this.ultimateMode = ultimateBoard;
        this._board = this.loadPlayBoard(boardSize);
        this._winningMessageTextElement = document.getElementById('info__message')!;
        this._ultimateWinningMessageTextElement = document.getElementById('ultimate-info__message')!;
        this.updateScoreBoardNames(ultimateBoard);
        this.updateScores(ultimateBoard);
    }

    // ゲームを初期化
    public initializeGame(): void {
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        this.handleAddClick();
    }

    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    public continueGame(): void {
        this.initializeGame();
        this.handleClearBoard();
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        }
    }

    // ゲームをリスタート
    public resetGame(): void {
        this.resetScores();
        this.initializeGame();
        this.handleClearBoard();
    }

    // プレイヤー交代
    public switchPlayer(): void {
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        }
    }

    // スコアをリセット
    private resetScores(): void {
        this._scores = {
            'X': 0,
            'O': 0
        };
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
        this.updatePlayerNamesForm();
    }

    // 名前入力画面から名前だけ変更
    public updatePlayerNamesForm(): void {
        (document.getElementById('name-setting__form__player1') as HTMLInputElement).value = this._players['X'].name;
        (document.getElementById('name-setting__form__player2') as HTMLInputElement).value = this._players['O'].name;
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
        if (this.ultimateMode) {
            (this._board as UltimateBoard).ultimateAddClickHandlers();
            (this._board as UltimateBoard).miniBoardResult.fill('');
        } else {
            this._board.addClickHandlers();
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
                    .map((cell, index) => ({ boardIndex: 0, cellIndex: index, cell }))
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
        this.saveGameStorage();
    }

    // localStorageに保存
    public saveGameStorage(): void {
        if (this.board) {
            const state = {
                players: this._players,
                currentPlayer: this._currentPlayer,
                scores: {
                    'X': this._scores['X'],
                    'O': this._scores['O']
                },
                isUltimate: this.ultimateMode,
                board: this.ultimateMode ? (this._board as UltimateBoard).getUltimateBoardState() : this._board.getBoardState(),
            };
            const storageKey = this.ultimateMode ? 'ticTacToeUltimateState' : 'ticTacToeNormalState';
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
    }
    
    // localStorageからボードとスコアをロード
    private loadPlayBoard(boardSize: number): Board | UltimateBoard {
        console.log("ローカルプレイヤーネーム");
        const normalState = localStorage.getItem('ticTacToeNormalState');
        const ultimateState = localStorage.getItem('ticTacToeUltimateState');
        const boardContainer = document.querySelector('.board__container') as HTMLElement;
        const ultimateBoardContainer = document.querySelector('.ultimate__board__container') as HTMLElement;

        let state = null;
        
        if (this.ultimateMode && ultimateState) {
            console.log("アルティメットストレージ");
            state = JSON.parse(ultimateState);
        } else if (!this.ultimateMode && normalState) {
            console.log("ノーマルストレージ");
            state = JSON.parse(normalState);
        }
        if (state) {
            console.log(state)
            this._scores = {
                'X': state.scores ? state.scores['X'] : 0,
                'O': state.scores ? state.scores['O'] : 0
            }
            console.log(this._scores)
            this.ultimateMode = state.isUltimate;
            if (state.isUltimate) {
                console.log("アルティメット・ローカルストレージ");
                const ultimateBoard = new UltimateBoard(boardSize, ultimateBoardContainer, this);
                ultimateBoard.setUltimateBoardState(state.board);
                return ultimateBoard;
            } else {
                console.log("ノーマル・ローカルストレージ");
                const board = new Board(boardSize, boardContainer, this);
                board.setBoardState(state.board);
                return board;
            }
        }
        
        // デフォルトのボードを返す
        return this.ultimateMode
        ? new UltimateBoard(boardSize, ultimateBoardContainer, this)
        : new Board(boardSize, boardContainer, this);
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
        return this.ultimateMode ? this._ultimateWinningMessageTextElement : this._winningMessageTextElement;
    }
    
    get isCPUThinking(): boolean {
        return this._isCPUThinking;
    }
    
    // セッター
    set currentPlayers(player: { name: string, mark: string, isCPU: boolean }) {
        this._currentPlayer = player;
    }
    
    set board(board: Board | UltimateBoard) {
        this._board = board;
    }
}