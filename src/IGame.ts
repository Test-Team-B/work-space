import { IBoard } from "./IBoard";
import { IPlayer } from "./IPlayer";

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
    checkWin(): void;
    checkDraw(): void;
}