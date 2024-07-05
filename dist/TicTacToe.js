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
        this.board = null;
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
    }
    // 各ボタンにクリックイベントを付与する
    init() {
        this.submitButton.addEventListener('click', (e) => this.submitName(e));
        this.resetButton.addEventListener('click', () => this._resetGame());
        this.continueButton.addEventListener('click', () => this._continueGame());
        this.ultimateContinueButton.addEventListener('click', () => this._continueGame());
        this.ultimateResetButton.addEventListener('click', () => this._resetGame());
        this.ultimateCheckBox.addEventListener('change', () => this.handleUltimateCheckBox(this.ultimateCheckBox));
        this.ultimateNameSettingCheckBox.addEventListener('change', () => this.handleUltimateCheckBox(this.ultimateNameSettingCheckBox));
        this.levelSelect.addEventListener('change', () => this.cpuLevelSelect());
        this.cpuCheckBox.addEventListener('change', () => this.updateCPUCheck());
        this.loadBoardNames(); // localStorageから名前フォームの初期化
    }
    // localStorageのプレイヤー名を名前入力フォームに初期化
    loadBoardNames() {
        const normalState = localStorage.getItem('ticTacToeNormalState');
        if (normalState) {
            let state = JSON.parse(normalState);
            document.getElementById('name-setting__form__player1').value = state.players.X.name;
            if (state.players.O.name !== "CPU") {
                document.getElementById('name-setting__form__player2').value = state.players.O.name;
            }
        }
    }
    // スタートボタンを押したらフォームが消えゲームがスタートする
    submitName(e) {
        e.preventDefault();
        this.gameModeChange();
        this.toggleElementVisibility(this.nameBoard, false);
        this.startGame();
    }
    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    startGame() {
        this.game = this.createGame();
        this.game.initializeGame();
        this.game.saveGameStorage();
    }
    // ゲームをコンティニューする
    _continueGame() {
        var _a, _b;
        (_a = this.game) === null || _a === void 0 ? void 0 : _a.continueGame();
        (_b = this.game) === null || _b === void 0 ? void 0 : _b.saveGameStorage();
    }
    // ゲームをlocalStorageを含めリセットする
    _resetGame() {
        var _a, _b;
        const confirmation = confirm("本当にリセットしますか？");
        if (confirmation) {
            (_a = this.game) === null || _a === void 0 ? void 0 : _a.resetGame();
            (_b = this.game) === null || _b === void 0 ? void 0 : _b.saveGameStorage();
        }
    }
    // ゲームインスタンスの作成
    createGame() {
        const isCPUMode = this.cpuLevelSelect();
        const isUltimate = this.ultimateCheckBox.checked;
        const playerXName = document.getElementById('name-setting__form__player1').value || 'Player X';
        const playerOName = document.getElementById('name-setting__form__player2').value || 'Player O';
        return new Game(playerXName, playerOName, boardSize, isCPUMode, isUltimate);
    }
    // ゲームボード画面の選択
    gameModeChange() {
        if (this.ultimateCheckBox.checked) {
            this.displayChange(this.ultimateContainer, this.mainContainer);
        }
        else {
            this.displayChange(this.mainContainer, this.ultimateContainer);
        }
    }
    // アルティメットモードの切り替えの連動
    handleUltimateCheckBox(changedCheckBox) {
        if (changedCheckBox === this.ultimateCheckBox) {
            this.ultimateNameSettingCheckBox.checked = this.ultimateCheckBox.checked;
        }
        else if (changedCheckBox === this.ultimateNameSettingCheckBox) {
            this.ultimateCheckBox.checked = this.ultimateNameSettingCheckBox.checked;
        }
    }
    // 画面を消したり表示させたり
    displayChange(showElement, hideElement) {
        this.toggleElementVisibility(hideElement, false);
        this.toggleElementVisibility(showElement, true);
    }
    toggleElementVisibility(element, isVisible) {
        if (element) {
            element.classList.toggle('d-flex', isVisible);
            element.classList.toggle('d-none', !isVisible);
        }
    }
    // CPUモードにしたらPlayer2の名前入力フォームにCPUが入る
    updateCPUCheck() {
        this.playerONameFormElement.value = this.cpuCheckBox.checked ? 'CPU' : '';
    }
    // CPUのレベルの選択
    cpuLevelSelect() {
        let isCPUMode = null;
        if (this.cpuCheckBox.checked) {
            const selectText = this.levelSelect.options[this.levelSelect.selectedIndex].text;
            switch (selectText) {
                case 'EASY':
                    isCPUMode = "easy";
                    break;
                case 'MEDIUM':
                    isCPUMode = "medium";
                    break;
                case 'HARD':
                    isCPUMode = "hard";
                    break;
                default:
                    break;
            }
        }
        return isCPUMode;
    }
}
