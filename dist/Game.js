import { Board } from "./Board.js";
import { UltimateBoard } from "./ultimateBoard.js";
export class Game {
    constructor(playerXName, playerOName, boardSize, isCPUOpponent = false, ultimateBoard = false) {
        this._isCPUThinking = false;
        this._players = {
            'X': { name: playerXName, mark: 'X', isCPU: false },
            'O': { name: playerOName, mark: 'O', isCPU: isCPUOpponent }
        };
        this._currentPlayer = this._players['X'];
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._winningMessageTextElement = document.getElementById('info__message');
        this._ultimateWinningMessageTextElement = document.getElementById('ultimate-info__message');
        const boardContainer = document.querySelector('.board__container');
        const ultimateBoardContainer = document.querySelector('.ultimate__board__container');
        this._board = ultimateBoard
            ? new UltimateBoard(boardSize, ultimateBoardContainer, this)
            : new Board(boardSize, boardContainer, this);
        this.updateScoreBoardNames();
    }
    // ゲームを初期化
    initializeGame() {
        console.log("initialize!!!");
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        // this.loadGameStorage();
        if (this._board instanceof UltimateBoard) {
            console.log("アルティメットクリアボード");
            this._board.clearUltimateBoard();
        }
        else {
            console.log("ノーマルクリアボード");
            this._board.clearBoard();
        }
        this.updateScores();
    }
    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    continueGame() {
        this.initializeGame();
    }
    // ゲームをリスタート
    resetGame() {
        this.resetScores();
        this.initializeGame();
    }
    // スコアをリセット
    resetScores() {
        this._scores = {
            'X': 0,
            'O': 0
        };
    }
    // プレイヤー交代
    switchPlayer() {
        console.log("スウィッチ");
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            console.log("CPU's turn");
            this.playCPUTurn();
        }
        else {
            console.log("Human's turn");
        }
    }
    playCPUTurn() {
        console.log("プレイCPU");
        this._isCPUThinking = true;
        setTimeout(() => {
            let emptyCells = [];
            if (this._board instanceof UltimateBoard) {
                console.log("アルティメットCPU");
                const boardIndex = this._board.currentBoardIndex !== null ? this._board.currentBoardIndex : Math.floor(Math.random() * this._board.miniBoards.length);
                this._board.miniBoards[boardIndex].cells.forEach((cell, cellIndex) => {
                    if (!cell.mark) {
                        emptyCells.push({ boardIndex, cellIndex, cell });
                    }
                });
            }
            else {
                console.log("ノーマルボードCPU");
                emptyCells = this._board.cells
                    .map((cell, index) => ({ boardIndex: 0, cellIndex: index, cell }))
                    .filter(({ cell }) => !cell.mark);
            }
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const { boardIndex, cellIndex } = randomCell;
                if (this._board instanceof UltimateBoard) {
                    this._board.ultimateMarkCell(boardIndex, cellIndex, this._currentPlayer.mark);
                    console.log("アルティメットマークセルしたよ");
                }
                else {
                    console.log("ノーマルマークしたよ");
                    this._board.markCell(cellIndex, this._currentPlayer.mark);
                }
                if (this.checkWin()) {
                    this.handleEndGame(false);
                }
                else if (this.checkDraw()) {
                    this.handleEndGame(true);
                }
                else {
                    this.switchPlayer();
                    this.winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
                }
                this.saveGameStorage();
                this._isCPUThinking = false;
            }
        }, 1000);
    }
    // ゲーム結果の表示、スコアの更新
    handleEndGame(draw) {
        console.log("ハンドエンド");
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        }
        else {
            this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            this._scores[this._currentPlayer.mark]++;
            this.updateScores();
        }
        console.log("ウィニングメッセージ");
        console.log(this.winningMessageTextElement);
    }
    // スコアボードの更新
    updateScores() {
        console.log("スコアボードの更新");
        if (this.board instanceof UltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-score').innerText = `${this._scores['X']}`;
            document.getElementById('ultimate-scoreboard__O-score').innerText = `${this._scores['O']}`;
        }
        else {
            document.getElementById('scoreboard__X__score').innerText = `${this._scores['X']}`;
            document.getElementById('scoreboard__O__score').innerText = `${this._scores['O']}`;
        }
    }
    // スコアボードの名前を更新
    updateScoreBoardNames() {
        console.log("スコアボードの名前の更新");
        if (this.board instanceof UltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-name').innerText = this._players['X'].name;
            document.getElementById('ultimate-scoreboard__O-name').innerText = this._players['O'].name;
        }
        else {
            document.getElementById('scoreboard__X__name').innerText = this._players['X'].name;
            document.getElementById('scoreboard__O__name').innerText = this._players['O'].name;
        }
    }
    // カプセル化、勝ち判定
    checkWin() {
        return this._board.checkWin();
    }
    // カプセル化、引き分け判定
    checkDraw() {
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
        }
        else {
            return this._winningMessageTextElement;
        }
    }
    get isCPUThinking() {
        return this._isCPUThinking;
    }
    // セッター
    set currentPlayers(player) {
        this._currentPlayer = player;
    }
    set board(board) {
        this._board = board;
    }
    // localStorageに保存
    saveGameStorage() {
        const gameState = {
            players: this._players,
            currentPlayer: this._currentPlayer,
            scores: this._scores,
            board: this._board.getBoardState()
        };
        localStorage.setItem('ticTacToeState', JSON.stringify(gameState));
    }
    // localStorageから取得
    loadGameStorage() {
        const gameState = localStorage.getItem('ticTacToeState');
        if (gameState) {
            const state = JSON.parse(gameState);
            this._players = state.players;
            this._currentPlayer = state.currentPlayer;
            this._scores = state.scores;
            this._board.setBoardState(state.board);
        }
    }
}
