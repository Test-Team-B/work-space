import { Game } from './Game.js';
const boardSize = 3;
// HTML の初期文書が完全に読み込まれた時点でイベントを発生させる
// TicTacToeインスタンスの作成、初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});
class TicTacToe {
    constructor() {
        this.game = null;
        this.submitButton = document.getElementById('name-setting__form__submit');
        this.startGameButton = document.getElementById('info__btn__start');
        this.continueButton = document.getElementById('info__btn__continue');
        this.resetButton = document.getElementById('info__btn__reset');
        this.nameBoard = document.getElementById('name-setting');
    }
    // 各ボタンにクリックイベントを付与する
    init() {
        this.submitButton.addEventListener('click', () => this.submitName());
        this.startGameButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.continueButton.addEventListener('click', () => this.continueGame());
    }
    submitName() {
        this.startGame();
        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');
    }
    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    startGame() {
        const playerXName = document.getElementById('name-setting__form__player1').value || 'Player X';
        const playerOName = document.getElementById('name-setting__form__player2').value || 'Player O';
        this.game = new Game(playerXName, playerOName, boardSize);
        this.game.startGame();
    }
    // ゲームをコンティニュする、カプセル化
    continueGame() {
        if (this.game) {
            this.game.continueGame();
        }
    }
    // ゲームをリセットする、カプセル化
    resetGame() {
        if (this.game) {
            this.game.resetGame();
        }
    }
}
