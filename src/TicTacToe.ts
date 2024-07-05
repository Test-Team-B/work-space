import { Game } from './Game.js';

const boardSize = 3;

// HTML の初期文書が完全に読み込まれた時点で初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});

class TicTacToe {
    private game: Game | null = null;
    private submitButton: HTMLElement;
    private continueButton: HTMLElement;
    private resetButton: HTMLElement;
    private ultimateContinueButton: HTMLElement;
    private ultimateResetButton: HTMLElement;
    private nameBoard: HTMLElement;
    private mainContainer: HTMLElement;
    private ultimateContainer: HTMLElement;
    private ultimateCheckBox: HTMLInputElement;
    private ultimateNameSettingCheckBox: HTMLInputElement;
    private levelSelect: HTMLSelectElement;
    private cpuCheckBox: HTMLInputElement;
    private playerONameFormElement: HTMLInputElement;

    constructor() {
        this.submitButton = document.getElementById('name-setting__form__submit')!;
        this.continueButton = document.getElementById('info__btn__continue')!;
        this.resetButton = document.getElementById('info__btn__reset')!;
        this.nameBoard = document.getElementById('name-setting')!;
        this.mainContainer = document.querySelector('.main-container')!;
        this.ultimateContainer = document.querySelector('.ultimate-container')!;
        this.ultimateContinueButton = document.getElementById('ultimate-info__btn__continue')!;
        this.ultimateResetButton = document.getElementById('ultimate-info__btn__reset')!;
        this.ultimateCheckBox = document.querySelector('#ultimate') as HTMLInputElement;
        this.ultimateNameSettingCheckBox = document.querySelector('#name-setting__select-ultimate') as HTMLInputElement;
        this.levelSelect = document.querySelector('#options__level-selection') as HTMLSelectElement;
        this.cpuCheckBox = document.querySelector('#name-setting__select-cpu') as HTMLInputElement;
        this.playerONameFormElement = document.getElementById('name-setting__form__player2') as HTMLInputElement;
    }

    // 各ボタンにクリックイベントを付与する
    public init(): void {
        this.submitButton.addEventListener('click', (e) => this.submitName(e));
        this.resetButton.addEventListener('click', () => this._resetGame());
        this.continueButton.addEventListener('click', () => this._continueGame());
        this.ultimateContinueButton.addEventListener('click', () => this._continueGame());
        this.ultimateResetButton.addEventListener('click', () => this._resetGame());
        this.ultimateCheckBox.addEventListener('change', () => this.handleUltimateCheckBox(this.ultimateCheckBox));
        this.ultimateNameSettingCheckBox.addEventListener('change', () => this.handleUltimateCheckBox(this.ultimateNameSettingCheckBox));
        this.levelSelect.addEventListener('change', () => this.cpuLevelSelect());
        this.cpuCheckBox.addEventListener('change', () => this.updateCPUCheck());
        this.loadBoardNames();  // localStorageから名前フォームの初期化
    }

    // localStorageのプレイヤー名を名前入力フォームに初期化
    private loadBoardNames(): void {
        const normalState = localStorage.getItem('ticTacToeNormalState');
        if (normalState) {
            let state = JSON.parse(normalState);
            (document.getElementById('name-setting__form__player1') as HTMLInputElement).value = state.players.X.name;
            if (state.players.O.name !== "CPU") {
                (document.getElementById('name-setting__form__player2') as HTMLInputElement).value = state.players.O.name;
            }
        }
    }

    // スタートボタンを押したらフォームが消えゲームがスタートする
    private submitName(e: Event): void {
        e.preventDefault();
        this.gameModeChange();
        this.toggleElementVisibility(this.nameBoard, false);
        this.startGame();
    }

     // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
     private startGame(): void {
        this.game = this.createGame();
        this.game.initializeGame();
        this.game.saveGameStorage();
    }

    // ゲームをコンティニューする
    private _continueGame(): void {
        this.game?.continueGame();
        this.game?.saveGameStorage();
    }

    // ゲームをlocalStorageを含めリセットする
    private _resetGame(): void {
        const confirmation = confirm("全ての履歴が消えます。本当にリセットしますか？");
        if (confirmation) {
            localStorage.removeItem('ticTacToeNormalState');
            localStorage.removeItem('ticTacToeUltimateState');
            this.game?.resetGame();
            this.game?.saveGameStorage();
        }
    }
    
    // ゲームインスタンスの作成
    private createGame(): Game {
        const isCPUMode = this.cpuLevelSelect();
        const isUltimate = this.ultimateCheckBox.checked;
        const playerXName = (document.getElementById('name-setting__form__player1') as HTMLInputElement).value || 'Player X';
        const playerOName = (document.getElementById('name-setting__form__player2') as HTMLInputElement).value || 'Player O';
        return new Game(playerXName, playerOName, boardSize, isCPUMode, isUltimate);
    }

    // ゲームボード画面の選択
    private gameModeChange(): void {
        if (this.ultimateCheckBox.checked) {
            this.displayChange(this.ultimateContainer, this.mainContainer);
        } else {
            this.displayChange(this.mainContainer, this.ultimateContainer);
        }
    }

     // アルティメットモードの切り替えの連動
    private handleUltimateCheckBox(changedCheckBox: HTMLInputElement): void {
        if (changedCheckBox === this.ultimateCheckBox) {
            this.ultimateNameSettingCheckBox.checked = this.ultimateCheckBox.checked;
        } else if (changedCheckBox === this.ultimateNameSettingCheckBox) {
            this.ultimateCheckBox.checked = this.ultimateNameSettingCheckBox.checked;
        }
    }

    // 画面を消したり表示させたり
    private displayChange(showElement: HTMLElement | null, hideElement: HTMLElement): void {
        this.toggleElementVisibility(hideElement, false);
        this.toggleElementVisibility(showElement, true);
    }

    private toggleElementVisibility(element: HTMLElement | null, isVisible: boolean): void {
        if (element) {
            element.classList.toggle('d-flex', isVisible);
            element.classList.toggle('d-none', !isVisible);
        }
    }

    // CPUモードにしたらPlayer2の名前入力フォームにCPUが入る
    private updateCPUCheck(): void {
        this.playerONameFormElement.value = this.cpuCheckBox.checked ? 'CPU' : '';
    }

    // CPUのレベルの選択
    private cpuLevelSelect(): string | null {
        let isCPUMode = null;
        if (this.cpuCheckBox.checked) {
            const selectText = this.levelSelect.options[this.levelSelect.selectedIndex].text
    
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

