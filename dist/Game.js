"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Player_1 = require("./Player");
const Board_1 = require("./Board");
class Game {
    constructor(playerXName, playerOName, boardSize) {
        this.players = {
            'X': new Player_1.Player('X', playerXName),
            'O': new Player_1.Player('O', playerOName)
        };
        this.currentPlayer = this.players['X'];
        this.board = new Board_1.Board(boardSize);
        this.scores = {
            'X': 0,
            'O': 0
        };
    }
    // スコアをリセットしゲームを初期化
    startGame() {
        this.resetScores();
        this.initializeGame();
    }
    // ゲームだけ初期化,スコアはそのまま
    continueGame() {
        this.initializeGame();
    }
    // ゲームを初期化
    initializeGame() {
        this.board.clearBoard();
        this.board.addClickHandlers(this);
        this.updateScores();
    }
    // スコアをリセット
    resetScores() {
        this.scores = {
            'X': 0,
            'O': 0
        };
    }
    // ゲームをリスタート
    resetGame() {
        this.resetScores();
        this.startGame();
    }
    // プレイヤー交代
    switchPlayer() {
        this.currentPlayer = this.currentPlayer.mark === 'X' ? this.players['O'] : this.players['X'];
    }
    // ゲーム結果の表示、スコアの更新
    handleEndGame(draw) {
        const winningMessageTextElement = document.getElementById('info__message');
        if (draw) {
            winningMessageTextElement.innerText = 'Draw!';
        }
        else {
            winningMessageTextElement.innerText = `${this.currentPlayer} Wins!`;
            this.scores[this.currentPlayer.mark]++;
            this.updateScores();
        }
    }
    // スコアボードの更新
    updateScores() {
        document.getElementById('scoreboard__X__score').innerText = `${this.scores['X']}`;
        document.getElementById('scoreboard__O__score').innerText = `${this.scores['0']}`;
    }
    // カプセル化、勝ち判定
    checkWin() {
        return this.board.checkWin();
    }
    // カプセル化、引き分け判定
    checkDraw() {
        return this.board.checkDraw();
    }
}
exports.Game = Game;
