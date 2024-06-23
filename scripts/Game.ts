class TicTacToe {
    private board: string[][];
    // private X_playerName: String;
    // private O_playerName: String;
    // private X_playerScore: String;
    // private O_playerScore: String;
    private currentPlayer: 'X' | 'O';
    // private gameResult: String;
    private gameOver: boolean;
    private winner: string | null = null;

    constructor() {
        this.board = [['', '', ''], ['', '', ''], ['', '', '']];
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.winner = null;
        this.initializeGame();
    }


    private initializeGame(): void {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.winner = null;
    }

    public makeMove(row: number, col: number): boolean {
        if (this.isValidMove(row, col)) {
            this.board[row][col] = this.currentPlayer;
            this.checkGameOver();
            this.switchPlayer();
            return true;
        }
        return false;
    }

    private isValidMove(row: number, col: number): boolean {
        return !this.gameOver && this.board[row][col] === '';
    }

    private switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    private checkGameOver(): void {
        if (this.checkWinner()) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
        } else if (this.isBoardFull()) {
            this.gameOver = true;
        }
    }

    private checkWinner(): boolean {
        for (let i = 0; i < 3; i++) {
            if (this.checkLine(this.board[i][0], this.board[i][1], this.board[i][2]) ||
                this.checkLine(this.board[0][2], this.board[1][1], this.board[2][0])) {
                return true;
            }
        }
        return this.checkLine(this.board[0][0], this.board[1][1], this.board[2][2]) ||
            this.checkLine(this.board[0][2], this.board[1][1], this.board[2][0]);
    }

    private checkLine(a: string, b: string, c: string): boolean {
        return a != '' && a === b && b === c;
    }

    private isBoardFull(): boolean {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    public getBoard(): string[][] {
        return this.board.map(row => [...row]);
    }

    public getCurrentPlayer(): string {
        return this.currentPlayer;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public getWinner(): string | null {
        return this.winner;
    }

    public resetGame(): void {
        this.initializeGame();
    }
}

const game = new TicTacToe();
// player x が勝利するパターン
// console.log(game.getCurrentPlayer());
// game.makeMove(0, 0);
// game.makeMove(0, 1);
// game.makeMove(1, 1);
// game.makeMove(0, 2);
// game.makeMove(2, 2);
// game.makeMove(1, 2);
// console.log(game.getWinner());

// 引き分けのパターン
// game.makeMove(0, 0);
// game.makeMove(0, 1);
// game.makeMove(0, 2);
// game.makeMove(1, 0);
// game.makeMove(1, 1);
// game.makeMove(1, 2);
// game.makeMove(2, 0);
// game.makeMove(2, 1);
// game.makeMove(2, 2);
// console.log(game.isGameOver());