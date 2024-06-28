import { Game } from './Game.js';

const boardSize = 3;

// HTML の初期文書が完全に読み込まれた時点で初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});

class TicTacToe {
    private submitButton: HTMLElement;
    private continueButton: HTMLElement;
    private resetButton: HTMLElement;
    private nameBoard: HTMLElement;
    private game: Game | null = null;


    constructor() {
        this.submitButton = document.getElementById('name-setting__form__submit')!;
        this.continueButton = document.getElementById('info__btn__continue')!;
        this.resetButton = document.getElementById('info__btn__reset')!;
        this.nameBoard = document.getElementById('name-setting')!;

        this.loadPlayerName();
    }

    // 各ボタンにクリックイベントを付与する
    public init(): void {
        this.submitButton.addEventListener('click', (e) => this.submitName(e));
        this.resetButton.addEventListener('click', () => this._resetGame());
        this.continueButton.addEventListener('click', () => this._continueGame());
    }
    // プレイヤー名を取得する
    public getPlayerNames(): { playerXName: string, playerOName: string, isCPUOpponent: boolean } {
        const isCPUOpponent = true;
        const playerXName = (document.getElementById('name-setting__form__player1') as HTMLInputElement).value || 'Player X';
        const playerOName = (isCPUOpponent) ? "CPU" : (document.getElementById('name-setting__form__player2') as HTMLInputElement).value || 'Player O';
        return { playerOName, playerXName, isCPUOpponent };
    }
    
    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    private submitName(e: Event): void {
        e.preventDefault(); // フォームの送信を防ぐ
        
        const { playerXName, playerOName, isCPUOpponent } = this.getPlayerNames();
        this.startGame(playerXName, playerOName, isCPUOpponent);
        
        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');
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
    private startGame(playerXName: string, playerOName: string, isCPUOpponent: boolean): void {
        this.game = new Game(playerXName, playerOName, boardSize, isCPUOpponent);
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
