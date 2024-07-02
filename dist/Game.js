import { Board } from "./Board.js";
export class Game {
    constructor(playerXName, playerOName, boardSize, difficulty = 'easy') {
        this._isCPUThinking = false;
        this._players = {
            'X': { name: playerXName, mark: 'X', isCPU: false },
            'O': { name: playerOName, mark: 'O', isCPU: true }
        };
        this._currentPlayer = this._players['X'];
        this._board = new Board(boardSize, undefined, this);
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._winningMessageTextElement = document.getElementById('info__message');
        this.updateScoreBoardNames();
        const boardContainer = document.querySelector('.board__container');
        if (boardContainer instanceof HTMLElement) {
            this._board = new Board(boardSize, boardContainer, this);
        }
        else {
            throw new Error("Board container element not found");
        }
        this._difficulty = difficulty;
    }
    // ゲームを初期化
    initializeGame() {
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        this.loadGameStorage();
        this._board.addClickHandlers();
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
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        }
    }
    get isCPUThinking() {
        return this._isCPUThinking;
    }
    playCPUTurn() {
        this._isCPUThinking = true;
        setTimeout(() => {
            const bestMove = this.findBestMove();
            if (bestMove !== -1) {
                this._board.markCell(bestMove, this._currentPlayer.mark);
                if (this.checkWin()) {
                    this.handleEndGame(false);
                }
                else if (this.checkDraw()) {
                    this.handleEndGame(true);
                }
                else {
                    this.switchPlayer();
                }
                this.saveGameStorage();
            }
            this._isCPUThinking = false;
        }, 1000);
    }
    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        const emptyCells = this._board.getEmptyCells();
        for (const move of emptyCells) {
            this._board.placeMarkTemp(move, this._currentPlayer.mark);
            const score = this.minimax(0, -Infinity, Infinity, false);
            this._board.removeMarkTemp(move);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    }
    minimax(depth, alpha, beta, isMaximizing) {
        if (this._board.checkWin()) {
            const winner = isMaximizing ? this._currentPlayer.mark : (this._currentPlayer.mark === 'O' ? 'X' : 'O');
            return isMaximizing ? depth - (this._board.size + 1) ** 2 : (this._board.size ** 2 + 1) - depth;
        }
        else if (this._board.checkDraw() || depth === this._board.size ** 2) {
            return 0;
        }
        const currentMark = isMaximizing ? this._currentPlayer.mark : (this._currentPlayer.mark === 'O' ? 'X' : 'O');
        const emptyCells = this._board.getEmptyCells();
        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of emptyCells) {
                this._board.placeMarkTemp(move, currentMark);
                const score = this.minimax(depth + 1, alpha, beta, false);
                this._board.removeMarkTemp(move);
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, maxScore);
                if (beta <= alpha) {
                    break;
                }
                ;
            }
            return maxScore;
        }
        else {
            let minScore = Infinity;
            for (const move of emptyCells) {
                this._board.placeMarkTemp(move, currentMark);
                const score = this.minimax(depth + 1, alpha, beta, true);
                this._board.removeMarkTemp(move);
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, minScore);
                if (beta <= alpha) {
                    break;
                }
                ;
            }
            return minScore;
        }
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
