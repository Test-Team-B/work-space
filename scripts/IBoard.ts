import { ICell } from './ICell.js'

export interface IBoard {
    cells: ICell[];
    size: number;

    markCell(cellIndex: number, mark: string): void;
    checkWin(): boolean;
    checkDraw(): boolean;
}
