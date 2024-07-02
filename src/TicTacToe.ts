import { Game } from './Game.js';
import { Board } from './Board.js';
import { UltimateBoard } from './ultimateBoard.js';

const boardSize = 3;

// HTML の初期文書が完全に読み込まれた時点で初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});

class TicTacToe {
    private game: Game | null = null;
    private board: Board | null = null;
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

        const saveState = localStorage.getItem('ticTacToeState');
        if (saveState) {
            const state = JSON.parse(saveState);
            console.log(state);
        }
        // this.loadPlayBoard();
        this.startGame();
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
    }

    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    private submitName(e: Event): void {
        e.preventDefault(); // フォームの送信を防ぐ

        this.createGame();
        if (this.game) {
            const playerXName = this.game.players.X.name;
            const playerOName = this.game.players.O.name;
            this.game.updatePlayerNames(playerXName, playerOName);
            this.gameModeChange();
            this.updateCPUCheck();
            this.game.saveGameStorage();
        }
        this.toggleElementVisibility(this.nameBoard, false);
    }
    
    // ゲームインスタンスの作成
    public createGame(): Game {
        const isCPUOpponent = this.cpuCheckBox.checked ? this.cpuLevelSelect() : false;
        const isUltimate = this.ultimateCheckBox.checked;
        const playerXName = (document.getElementById('name-setting__form__player1') as HTMLInputElement)?.value || 'Player X';
        const playerOName = (document.getElementById('name-setting__form__player2') as HTMLInputElement)?.value || 'Player O';
        return new Game(playerXName, playerOName, boardSize, isCPUOpponent, isUltimate);
    }

    // ゲームボードの種類の選択
    private gameModeChange(): void {
        if (this.ultimateCheckBox.checked) {
            this.displayChange(this.ultimateContainer, this.mainContainer);
        } else {
            this.displayChange(this.mainContainer, this.ultimateContainer);
        }
        this.startGame();
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
        // this.createGame();
        // this.startGame();
    }

    // アルティメットモードの切り替え
    private handleUltimateCheckBox(changedCheckBox: HTMLInputElement): void {
        console.log("アルティメットがチエックボックスがクリックされました")
        if (changedCheckBox === this.ultimateCheckBox) {
            this.ultimateNameSettingCheckBox.checked = this.ultimateCheckBox.checked;
        } else if (changedCheckBox === this.ultimateNameSettingCheckBox) {
            this.ultimateCheckBox.checked = this.ultimateNameSettingCheckBox.checked;
        }
        this.createGame();
    }

    // CPUのレベルの選択
    private cpuLevelSelect(): boolean {
        const selectText = this.levelSelect.options[this.levelSelect.selectedIndex].text
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
    private loadPlayBoard(): void {
        console.log("ローカルプレイヤーネーム")
        const saveState = localStorage.getItem('ticTacToeState');
        if (saveState) {
            const state = JSON.parse(saveState);
            console.log(state.isCPU);
            (document.getElementById('name-setting__form__player1') as HTMLInputElement).value = state.players.X.name;
            (document.getElementById('name-setting__form__player2') as HTMLInputElement).value = state.players.O.name;
            this.cpuCheckBox.checked = state.players.O.isCPU;
            console.log(state.isUltimate)
            this.ultimateNameSettingCheckBox.checked = state.isUltimate;
            this.handleUltimateCheckBox(this.ultimateNameSettingCheckBox);

            if (state.isUltimate) {
                console.log("アルティメット・ローカルストレージ")
                const ultimateBoardContainer = document.querySelector('.ultimate__board__container') as HTMLElement;
                this.board = new UltimateBoard(boardSize, ultimateBoardContainer, this.game!);
                (this.board as UltimateBoard).setUltimateBoardState(state.board);
            } else {
                console.log("ノーマル・ローカルストレージ")
                const boardContainer = document.querySelector('.board__container') as HTMLElement;
                this.board = new Board(boardSize, boardContainer, this.game!);
                this.board.setBoardState(state.board);
            }
        }
    }

    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    private startGame(): void {
        console.log("スタートゲーム")
        this.game = this.createGame();
        this.game.initializeGame();
        this.game.saveGameStorage();
    }

    // ゲームをコンティニューする、カプセル化
    private _continueGame(): void {
        this.game?.continueGame();
        this.game?.saveGameStorage();
    }

    // ゲームをlocalStorageを含めリセットする、カプセル化
    private _resetGame(): void {
        console.log("リセット・ローカルストレージ")
        localStorage.removeItem('ticTacToeState');
        this.game?.resetGame();
        this.game?.saveGameStorage();
    }
}
