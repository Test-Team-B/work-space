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
        this.ultimateContinueButton = document.getElementById('ultimate-info__btn__continue');
        this.ultimateResetButton = document.getElementById('ultimate-info__btn__reset');
        this.nameBoard = document.getElementById('name-setting');
        this.mainContainer = document.querySelector('.main-container');
        this.ultimateContainer = document.querySelector('.ultimate-container');
        this.ultimateCheckBox = document.querySelector('#Ultimate');
        this.levelSelect = document.querySelector('#options__level-selection');
        this.startGame();
        // this.loadPlayerName();
    }
    // 各ボタンにクリックイベントを付与する
    init() {
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => this.submitName(e));
        }
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this._resetGame());
        }
        if (this.continueButton) {
            this.continueButton.addEventListener('click', () => this._continueGame());
        }
        if (this.ultimateContinueButton) {
            this.ultimateContinueButton.addEventListener('click', () => this._continueGame());
        }
        if (this.ultimateResetButton) {
            this.ultimateResetButton.addEventListener('click', () => this._resetGame());
        }
        if (this.ultimateCheckBox) {
            this.ultimateCheckBox.addEventListener('change', () => this.gameModeChange());
        }
        if (this.levelSelect) {
            this.levelSelect.addEventListener('change', () => this.cpuLevelSelect());
        }
    }
    // プレイヤー名を取得する
    getPlayerNames() {
        var _a, _b;
        const isCPUOpponent = this.cpuLevelSelect();
        const isUltimate = this.ultimateCheckBox.checked;
        const playerXName = ((_a = document.getElementById('name-setting__form__player1')) === null || _a === void 0 ? void 0 : _a.value) || 'Player X';
        const playerOName = (isCPUOpponent) ? "CPU" : ((_b = document.getElementById('name-setting__form__player2')) === null || _b === void 0 ? void 0 : _b.value) || 'Player O';
        return { playerOName, playerXName, isCPUOpponent, isUltimate };
    }
    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    submitName(e) {
        e.preventDefault(); // フォームの送信を防ぐ
        const { playerXName, playerOName } = this.getPlayerNames();
        if (this.game) {
            this.game.updatePlayerNames(playerXName, playerOName);
        }
        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');
    }
    // ゲームボードの種類の選択
    gameModeChange() {
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
        this.startGame();
    }
    // CPUのレベルの選択
    cpuLevelSelect() {
        const selectValue = this.levelSelect.value;
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
        return isCPUOpponent;
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
    startGame() {
        const { playerXName, playerOName, isCPUOpponent, isUltimate } = this.getPlayerNames();
        this.game = new Game(playerXName, playerOName, boardSize, isCPUOpponent, isUltimate);
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
