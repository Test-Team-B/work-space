import { IGame } from "./IGame";
import { IPlayer } from "./IPlayer";
import { IBoard } from "./IBoard";
import { Player } from "./Player";
import { Board } from "./Board"

class Game implements IGame {
    public players: { [key: string]: IPlayer};
    public currentPlayer: IPlayer;
    public board: IBoard;
    public scores: { [key: string]: number};

    constructor(boardSize: number) {
        this.players = {
            'X' : new Player('X'),
            'O' : new Player('O')
        }
        this.currentPlayer = this.players['X'];
        this.board = new Board(boardSize);
        this.scores = {
            'X': 0,
            'O': 0
        };
    }

    // スコアをリセットしゲームを初期化
    public startGame(): void {
        this.resetScores();
        this.initializeGame();
    }

    // ゲームだけ初期化,スコアはそのまま
    public continueGame(): void {
        this.initializeGame();
    }

    // ゲームを初期化
    private initializeGame(): void {
        this.board.clearBoard();
        this.board.addClickHandlers(this);
        //document.getElementById('info__message')?.classList.add('hide');
        this.updateScores();
    }

    // スコアをリセット
    private resetScores(): void {
        this.scores = {
            'X': 0,
            'O': 0
        };
    }
    // ゲームをリスタート
    public resetGame(): void {
        this.resetScores();
        this.startGame();
    }

    // プレイヤー交代
    public switchPlayer(): void {
        this.currentPlayer = this.currentPlayer.mark === 'X' ? this.players['O'] : this.players['X'];
    }

    // ゲーム結果の表示、スコアの更新
    public handleEndGame(draw: boolean): void {
        const winningMessageTextElement = document.getElementById('info__message')!;
        if (draw) {
            winningMessageTextElement.innerText = 'Draw!';
        } else {
            winningMessageTextElement.innerText = `${this.currentPlayer} Wins!`;
            this.scores[this.currentPlayer.mark]++;
            this.updateScores();
        }
    }

    // スコアボードの更新
    public updateScores(): void {
        document.getElementById('scoreboard__X__score')!.innerText = `${this.scores['X']}`;
        document.getElementById('scoreboard__O__score')!.innerText = `${this.scores['0']}`;
    }

    // カプセル化、勝ち判定
    public checkWin(): boolean {
        return this.board.checkWin();
    }

    // カプセル化、引き分け判定
    public checkDraw(): boolean {
        return this.board.checkDraw();
    }
}
