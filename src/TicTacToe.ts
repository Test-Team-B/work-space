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
    private nameBoard: HTMLElement;
    private mainContainer: HTMLElement;
    private ultimateContainer: HTMLElement;
    private ultimateCheckBox: HTMLInputElement;
    private levelSelect: HTMLSelectElement;


    constructor() {
        this.submitButton = document.getElementById('name-setting__form__submit')!;
        this.continueButton = document.getElementById('info__btn__continue')!;
        this.resetButton = document.getElementById('info__btn__reset')!;
        this.nameBoard = document.getElementById('name-setting')!;
        this.mainContainer = document.querySelector('.main-container')!;
        this.ultimateContainer = document.querySelector('.ultimate-container')!;
        this.ultimateCheckBox = document.querySelector('#Ultimate') as HTMLInputElement;
        this.levelSelect = document.querySelector('#options__level-selection') as HTMLSelectElement;

        // this.loadPlayerName();
    }

    // 各ボタンにクリックイベントを付与する
    public init(): void {
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => this.submitName(e));
        }
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this._resetGame());
        }
        if (this.continueButton) {
            this.continueButton.addEventListener('click', () => this._continueGame());
        }
        if (this.ultimateCheckBox) {
            this.ultimateCheckBox.addEventListener('change', () => this.gameModeChange());
        }
        if (this.levelSelect) {
            this.levelSelect.addEventListener('change', () => this.cpuLevelSelect());
        }
    }

    // プレイヤー名を取得する
    public getPlayerNames(): { playerXName: string, playerOName: string, isCPUOpponent: boolean } {
        const isCPUOpponent = this.cpuLevelSelect();
        const playerXName = (document.getElementById('name-setting__form__player1') as HTMLInputElement)?.value || 'Player X';
        const playerOName = (isCPUOpponent) ? "CPU" : (document.getElementById('name-setting__form__player2') as HTMLInputElement)?.value || 'Player O';
        console.log("プレイヤーO名前")
        console.log(playerOName)
        return { playerOName, playerXName, isCPUOpponent};
    }

    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    private submitName(e: Event): void {
        e.preventDefault(); // フォームの送信を防ぐ

        this.startGame();

        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');

        this.gameModeChange();
    }

    // ゲームボードの種類の選択
    private gameModeChange(): void {
        if (this.ultimateCheckBox.checked) {
            if (this.mainContainer.classList.contains('d-flex')) {
                this.mainContainer.classList.remove('d-flex');
                this.mainContainer.classList.add('d-none');
            }
            this.ultimateContainer.classList.remove('d-none');
            this.ultimateContainer.classList.add('d-flex');

        } else {
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
    private cpuLevelSelect(): boolean {
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
    private loadPlayerName(): void {
        const saveState = localStorage.getItem('ticTacToeState');
        if (saveState) {
            const state = JSON.parse(saveState);
            (document.getElementById('name-setting__form__player1') as HTMLInputElement).value = state.players.X.name;
            (document.getElementById('name-setting__form__player2') as HTMLInputElement).value = state.players.O.name;
        }
    }

    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    private startGame(): void {
        const { playerXName, playerOName, isCPUOpponent } = this.getPlayerNames();
        const ultimateBoard = this.ultimateCheckBox.checked;
        this.game = new Game(playerXName, playerOName, boardSize, isCPUOpponent, ultimateBoard);
        this.game.initializeGame();
    }

    // ゲームをコンティニューする、カプセル化
    private _continueGame(): void {
        if (this.game) {
            this.game.continueGame();
        }
    }

    // ゲームをlocalStorageを含めリセットする、カプセル化
    private _resetGame(): void {
        localStorage.removeItem('ticTacToeState');
        if (this.game) {
            this.game.resetGame();
        }
    }
}
