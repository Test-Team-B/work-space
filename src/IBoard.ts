import { ICell } from './ICell'
import { IGame } from './IGame'

export interface IBoard {
    cells: ICell[];
    size: number;

    markCell(cellIndex: number, mark: string): void;
    checkWin(): boolean;
    checkDraw(): boolean;
    isCellEmpty(row: number, col: number): boolean;
    clearBoard(): void;
    getBoard(): string[][];
    addClickHandlers(game: IGame): void;
}