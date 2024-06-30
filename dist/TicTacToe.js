import { Game } from './Game.js';
const boardSize = 3;
// HTML の初期文書が完全に読み込まれた時点で初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});
class TicTacToe {
    constructor() {
        this.game = null;
        this.submitButton = document.getElementById('name-setting__form__submit');
        this.continueButton = document.getElementById('info__btn__continue');
        this.resetButton = document.getElementById('info__btn__reset');
        this.nameBoard = document.getElementById('name-setting');
        this.loadPlayerName();
    }
    // 各ボタンにクリックイベントを付与する
    init() {
        this.submitButton.addEventListener('click', (e) => this.submitName(e));
        this.resetButton.addEventListener('click', () => this._resetGame());
        this.continueButton.addEventListener('click', () => this._continueGame());
    }
    // プレイヤー名を取得する
    getPlayerNames() {
        const playerXName = document.getElementById('name-setting__form__player1').value || 'Player X';
        const playerOName = document.getElementById('name-setting__form__player2').value || 'Player O';
        const isCPUOpponent = true;
        return { playerOName, playerXName, isCPUOpponent };
    }
    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    submitName(e) {
        e.preventDefault(); // フォームの送信を防ぐ
        const { playerXName, playerOName, isCPUOpponent } = this.getPlayerNames();
        this.startGame(playerXName, playerOName, isCPUOpponent);
        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');
    }
    // localStorageに保存された名前を読み取る
    loadPlayerName() {
        const saveState = localStorage.getItem('ticTacToeState');
        if (saveState) {
            const state = JSON.parse(saveState);
            document.getElementById('name-setting__form__player1').value = state.players.X.name;
            document.getElementById('name-setting__form__player2').value = state.players.O.name;
        }
    }
    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    startGame(playerXName, playerOName, isCPUOpponent) {
        this.game = new Game(playerXName, playerOName, boardSize);
        this.game.initializeGame();
    }
    // ゲームをコンティニューする、カプセル化
    _continueGame() {
        if (this.game) {
            this.game.continueGame();
        }
    }
    // ゲームをlocalStorageを含めリセットする、カプセル化
    _resetGame() {
        localStorage.removeItem('ticTacToeState');
        if (this.game) {
            this.game.resetGame();
        }
    }
}
