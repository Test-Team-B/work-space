import { Board } from "./Board.js"

class ultimateBoard extends Board {
    miniBoards: Board[];

    constructor(size: number, parentElement: HTMLElement = document.querySelector('#ultimate__board')!) {
        super(size, parentElement);
        this.miniBoards = this.createMiniBoards(size, parentElement);
    }

    private createMiniBoards(size: number, parentElement: HTMLElement): Board[] {
        const miniBoards: Board[] = [];
        parentElement.innerHTML = '';   // 親要素の中身を空に初期化
        parentElement.style.display = 'grid';
        parentElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        parentElement.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;

        for (let i = 0; i < size * size; i++) {
            const miniBoardElement = document.createElement('div');
            miniBoardElement.classList.add('ultimateBoard__container__cell');
            miniBoardElement.dataset.ceeIndex = i.toString();
            parentElement.appendChild(miniBoardElement);

            miniBoards.push(new Board(size, miniBoardElement));
        }
        return miniBoards;
    }

    public markCell(cellIndex: number, mark: string): void {
        
    }

    public checkWin(): boolean {
        
    }

    public checkDraw(): boolean {
        
    }

    public addClickHandlers(game: any): void {
        
    }

    public clearBoard(): void {
        
    }

    public getBoardState(): { mark: string; }[] {
        
    }

    public setBoardState(state: { mark: string; }[]): void {
        
    }
}
