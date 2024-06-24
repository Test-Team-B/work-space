import { Player } from "./Player.js";
import { Board } from "./Board.js";
export class Game {
    constructor(playerXName, playerOName, boardSize) {
        this.players = {
            'X': new Player('X', playerXName),
            'O': new Player('O', playerOName)
        };
        this.currentPlayer = this.players['X'];
        this.board = new Board(boardSize);
        this.scores = {
            'X': 0,
            'O': 0
        };
        this.updateScoreBoardNames();
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
            winningMessageTextElement.innerText = `${this.currentPlayer.name} Wins!`;
            this.scores[this.currentPlayer.mark]++;
            this.updateScores();
        }
    }
    // スコアボードの更新
    updateScores() {
        document.getElementById('scoreboard__X__score').innerText = `${this.scores['X']}`;
        document.getElementById('scoreboard__O__score').innerText = `${this.scores['O']}`;
    }
    // スコアボードの名前を更新
    updateScoreBoardNames() {
        document.getElementById('scoreboard__X__name').innerText = this.players['X'].name;
        document.getElementById('scoreboard__O__name').innerText = this.players['O'].name;
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
