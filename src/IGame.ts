import { IBoard } from "./IBoard";
import { IPlayer } from "./IPlayer";

export interface IGame {
    players: { [key: string]: IPlayer};
    currentPlayer: IPlayer;
    board: IBoard;

    resetGame(): void;
    makeMove(row: number, col: number): boolean;
    switchPlayer(): void;
    getCurrentPlayer(): IPlayer;
    isGameOver(): boolean;
    getWinner(): string | null;
    handleEndGame(draw: boolean): void;
}