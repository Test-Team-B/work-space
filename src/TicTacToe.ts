import { Game } from './Game';

const boardSize = 3

// HTML の初期文書が完全に読み込まれた時点でイベントを発生させる
// TicTacToeインスタンスの作成、初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});

class TicTacToe {
    private startGameButton: HTMLElement;
    private continueButton: HTMLElement;
    private resetButton: HTMLElement;
    private game: Game | null = null;


    constructor() {
        this.startGameButton = document.getElementById('info__btn__start')!;
        this.continueButton = document.getElementById('info__btn__continue')!;
        this.resetButton = document.getElementById('info__btn__reset')!;
    }

    // 各ボタンにクリックイベントを付与する
    public init(): void {
        this.startGameButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.continueButton.addEventListener('click', () => this.continueGame());
    }

    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    private startGame(): void {
        const playerXName = (document.getElementById('name-setting__form__player1') as HTMLInputElement).value || 'Player X';
        const playerOName = (document.getElementById('name-setting__form__player2') as HTMLInputElement).value || 'Player O';
        this.game = new Game(playerXName, playerOName, boardSize);
        this.game.startGame();
    }

    // ゲームをコンティニュする、カプセル化
    private continueGame(): void {
        if (this.game) {
            this.game.continueGame();
        }
    }

    // ゲームをリセットする、カプセル化
    private resetGame(): void {
        if (this.game) {
            this.game.resetGame();
        }
    }
}
