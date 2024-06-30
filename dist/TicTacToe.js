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
        this.ultimateContinueButton = document.getElementById('ultimate-info__btn__continue');
        this.ultimateResetButton = document.getElementById('ultimate-info__btn__reset');
        this.ultimateCheckBox = document.querySelector('#ultimate');
        this.ultimateNameSettingCheckBox = document.querySelector('#name-setting__select-ultimate');
        this.levelSelect = document.querySelector('#options__level-selection');
        this.cpuCheckBox = document.querySelector('#name-setting__select-cpu');
        this.playerONameFormElement = document.getElementById('name-setting__form__player2');
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
            this.ultimateCheckBox.addEventListener('change', () => {
                const isChecked = this.ultimateCheckBox.checked;
                this.ultimateNameSettingCheckBox.checked = isChecked;
                this.gameModeChange();
            });
        }
        if (this.ultimateNameSettingCheckBox) {
            this.ultimateNameSettingCheckBox.addEventListener('change', () => {
                const isChecked = this.ultimateNameSettingCheckBox.checked;
                this.ultimateCheckBox.checked = isChecked;
                this.gameModeChange();
            });
        }
        if (this.levelSelect) {
            this.levelSelect.addEventListener('change', () => this.cpuLevelSelect());
        }
        if (this.cpuCheckBox) {
            this.cpuCheckBox.addEventListener('click', () => {
                this.updatePlayerONameForm();
                this.startGame();
            });
        }
    }
    // プレイヤー名を取得する
    getPlayerNames() {
        var _a, _b;
        const isCPUOpponent = this.cpuCheckBox.checked ? this.cpuLevelSelect() : false;
        const isUltimate = this.ultimateCheckBox.checked;
        const playerXName = ((_a = document.getElementById('name-setting__form__player1')) === null || _a === void 0 ? void 0 : _a.value) || 'Player X';
        const playerOName = ((_b = document.getElementById('name-setting__form__player2')) === null || _b === void 0 ? void 0 : _b.value) || 'Player O';
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
            this.displayChange(this.ultimateContainer, this.mainContainer);
        }
        else {
            this.displayChange(this.mainContainer, this.ultimateContainer);
        }
        this.startGame();
    }
    // 画面を消したり表示させたり
    displayChange(showElement, hideElement) {
        if (hideElement.classList.contains('d-flex')) {
            hideElement.classList.remove('d-flex');
            hideElement.classList.add('d-none');
        }
        showElement === null || showElement === void 0 ? void 0 : showElement.classList.remove('d-none');
        showElement === null || showElement === void 0 ? void 0 : showElement.classList.add('d-flex');
    }
    // CPUモードにしたらPlayer2の名前入力フォームにCPUが入る
    updatePlayerONameForm() {
        if (this.cpuCheckBox.checked) {
            this.playerONameFormElement.value = 'CPU'; // チェックが入った場合に表示する文字
        }
        else {
            this.playerONameFormElement.value = ''; // チェックが外れた場合にフォームをクリア
        }
    }
    // CPUのレベルの選択
    cpuLevelSelect() {
        const selectText = this.levelSelect.options[this.levelSelect.selectedIndex].text;
        let isCPUOpponent = false;
        switch (selectText) {
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
