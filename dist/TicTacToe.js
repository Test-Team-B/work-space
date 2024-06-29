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
        this.mainContainer = document.querySelector('.main-container');
        this.ultimateContainer = document.querySelector('.ultimate-container');
        this.ultimateCheckBox = document.querySelector('#Ultimate');
        // this.loadPlayerName();
    }
    // 各ボタンにクリックイベントを付与する
    init() {
        this.submitButton.addEventListener('click', (e) => this.submitName(e));
        this.resetButton.addEventListener('click', () => this._resetGame());
        this.continueButton.addEventListener('click', () => this._continueGame());
        this.ultimateCheckBox.addEventListener('click', () => this.boardModeChange());
    }
    // プレイヤー名を取得する
    getPlayerNames() {
        const levelSelect = document.getElementById('options__level-selection');
        const selectValue = levelSelect.value;
        let isCPUOpponent = false;
        switch (selectValue) {
            case 'EASY':
                isCPUOpponent = true;
                break;
            case 'MEDIUM':
                break;
            case 'HARD':
                break;
            default:
                break;
        }
        const playerXName = document.getElementById('name-setting__form__player1').value || 'Player X';
        const playerOName = (isCPUOpponent) ? "CPU" : document.getElementById('name-setting__form__player2').value || 'Player O';
        console.log("プレイヤーO名前");
        console.log(playerOName);
        return { playerOName, playerXName, isCPUOpponent };
    }
    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    submitName(e) {
        e.preventDefault(); // フォームの送信を防ぐ
        const { playerXName, playerOName, isCPUOpponent } = this.getPlayerNames();
        this.startGame(playerXName, playerOName, isCPUOpponent);
        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');
        this.boardModeChange();
    }
    boardModeChange() {
        if (this.ultimateCheckBox.checked) {
            if (this.mainContainer.classList.contains('d-flex')) {
                this.mainContainer.classList.remove('d-flex');
                this.mainContainer.classList.add('d-none');
            }
            this.ultimateContainer.classList.remove('d-none');
            this.ultimateContainer.classList.add('d-flex');
        }
        else {
            if (this.ultimateContainer.classList.contains('d-flex')) {
                this.ultimateContainer.classList.remove('d-flex');
                this.ultimateContainer.classList.add('d-none');
            }
            this.mainContainer.classList.remove('d-none');
            this.mainContainer.classList.add('d-flex');
        }
        // localStorageに保存された名前を読み取る
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
        console.log("アルティメットチェック");
        console.log(this.ultimateCheckBox.checked);
        const ultimateBoard = this.ultimateCheckBox.checked;
        this.game = new Game(playerXName, playerOName, boardSize, isCPUOpponent, ultimateBoard);
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
