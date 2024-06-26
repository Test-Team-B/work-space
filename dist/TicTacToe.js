import { Game } from './Game.js';
if (typeof (Storage) !== "undefined") {
    console.log("localStorage使用可能です");
}
else {
    console.error("localStorageがサポートされていないブラウザです");
}
const boardSize = 5;
// HTML の初期文書が完全に読み込まれた時点で初期化
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToe = new TicTacToe();
    ticTacToe.init();
});
class TicTacToe {
    constructor() {
        this.game = null;
        this.submitButton = document.getElementById('name-setting__form__submit');
        // this.startGameButton = document.getElementById('info__btn__start')!;
        this.continueButton = document.getElementById('info__btn__continue');
        this.resetButton = document.getElementById('info__btn__reset');
        this.nameBoard = document.getElementById('name-setting');
        this.loadPlayerName();
        console.log("constructorからloadPlayNameを呼び出しました");
        console.log("PlayerX : " + document.getElementById('name-setting__form__player1').value);
        console.log("PlayerO : " + document.getElementById('name-setting__form__player2').value);
    }
    // 各ボタンにクリックイベントを付与する
    init() {
        this.submitButton.addEventListener('click', (e) => this.submitName(e));
        // this.startGameButton.addEventListener('click', () => this.manualStartGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.continueButton.addEventListener('click', () => this.continueGame());
    }
    // プレイヤー名を取得する
    getPlayerNames() {
        const playerXName = document.getElementById('name-setting__form__player1').value || 'Player X';
        const playerOName = document.getElementById('name-setting__form__player2').value || 'Player O';
        return { playerOName, playerXName };
    }
    // 名前入力フォームでスタートボタンを押したらフォームが消えゲームがスタートする
    submitName(e) {
        e.preventDefault(); // フォームの送信を防ぐ
        const { playerXName, playerOName } = this.getPlayerNames();
        this.startGame(playerXName, playerOName);
        this.nameBoard.classList.remove('d-flex');
        this.nameBoard.classList.add('d-none');
    }
    // localStorageに保存された名前を読み取る
    loadPlayerName() {
        const saveState = localStorage.getItem('ticTacToeGameStorage');
        if (saveState) {
            const state = JSON.parse(saveState);
            document.getElementById('name-setting__form__player1').value = state.players.X.name;
            document.getElementById('name-setting__form__player2').value = state.players.O.name;
        }
        console.log("loadPlayerNameを実行しました");
    }
    // 名前を受け取りゲームインスタンスを作成、ゲームをスタートする
    startGame(playerXName, playerOName) {
        this.game = new Game(playerXName, playerOName, boardSize);
        this.game.startGame();
    }
    // ゲームスタート
    // private manualStartGame(): void {
    //     const { playerXName, playerOName } = this.getPlayerNames();
    //     this.startGame(playerXName, playerOName);
    // }
    // ゲームをコンティニューする、カプセル化
    continueGame() {
        if (this.game) {
            this.game.continueGame();
        }
    }
    // ゲームをlocalStorageを含めリセットする、カプセル化
    resetGame() {
        if (this.game) {
            this.game.resetGame();
            localStorage.removeItem('ticTacToeGameStorage');
            console.log("resetGameからlocalStorageを呼び出しました");
        }
    }
}
