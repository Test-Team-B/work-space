import { IBoard } from "./IBoard.js";
import { IPlayer } from "./IPlayer.js";

export interface IGame {
    players: { [key: string]: IPlayer};
    currentPlayer: IPlayer;
    board: IBoard;
    scores: { [key: string]: number}

    startGame(): void;
    continueGame(): void;
    resetGame(): void;
    switchPlayer(): void;
    handleEndGame(draw: boolean): void;
    updateScores(): void;
    checkWin(): boolean;
    checkDraw(): boolean;
}