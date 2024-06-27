import { Board } from "./Board.js";
export class Game {
    constructor(playerXName, playerOName, boardSize) {
        this._players = {
            'X': { name: playerXName, mark: 'X' },
            'O': { name: playerOName, mark: 'O' }
        };
        this._currentPlayer = this._players['X'];
        this._board = new Board(boardSize);
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._winningMessageTextElement = document.getElementById('info__message');
        this.updateScoreBoardNames();
    }
    // ゲームを初期化
    initializeGame() {
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        this.loadGameStorage();
        this._board.addClickHandlers(this);
        this.updateScores();
    }
    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    continueGame() {
        this.initializeGame();
        this._board.clearBoard();
    }
    // スコアをリセット
    resetScores() {
        this._scores = {
            'X': 0,
            'O': 0
        };
    }
    // ゲームをリスタート
    resetGame() {
        this._board.clearBoard();
        this.resetScores();
        this.initializeGame();
    }
    // プレイヤー交代
    switchPlayer() {
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
    }
    // ゲーム結果の表示、スコアの更新
    handleEndGame(draw) {
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        }
        else {
            this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            this._scores[this._currentPlayer.mark]++;
            this.updateScores();
        }
    }
    // スコアボードの更新
    updateScores() {
        document.getElementById('scoreboard__X__score').innerText = `${this._scores['X']}`;
        document.getElementById('scoreboard__O__score').innerText = `${this._scores['O']}`;
    }
    // スコアボードの名前を更新
    updateScoreBoardNames() {
        document.getElementById('scoreboard__X__name').innerText = this._players['X'].name;
        document.getElementById('scoreboard__O__name').innerText = this._players['O'].name;
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
        return this._winningMessageTextElement;
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
