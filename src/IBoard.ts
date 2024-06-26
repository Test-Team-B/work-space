import { ICell } from './ICell.js'
import { IGame } from './IGame.js'

export interface IBoard {
    cells: ICell[];
    size: number;

    markCell(cellIndex: number, mark: string): void;
    checkWin(): boolean;
    checkDraw(): boolean;
    clearBoard(): void;
    addClickHandlers(game: IGame): void;
}