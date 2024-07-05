import { Board } from "./Board.js";
import { UltimateBoard } from "./ultimateBoard.js";

export class Game {
    private _players: { [key: string]: { name: string, mark: string, isCPU: string | null } };
    private _currentPlayer: { name: string, mark: string, isCPU: string | null };
    private _isCPUThinking: boolean = false;
    private _board: Board | UltimateBoard;
    private _scores: { [key: string]: number };
    private _winningMessageTextElement: HTMLElement;
    private _ultimateWinningMessageTextElement: HTMLElement;
    private ultimateMode: boolean;

    constructor(playerXName: string, playerOName: string, boardSize: number, isCPUMode: string | null = null, ultimateBoard: boolean = false) {
        this._players = {
            'X': { name: playerXName, mark: 'X', isCPU: null },
            'O': { name: playerOName, mark: 'O', isCPU: isCPUMode }
        };
        this._scores = {
            'X': 0,
            'O': 0
        };
        this._currentPlayer = this._players['X'];
        this.ultimateMode = ultimateBoard;
        this._board = this.loadPlayBoard(boardSize);
        this._winningMessageTextElement = document.getElementById('info__message')!;
        this._ultimateWinningMessageTextElement = document.getElementById('ultimate-info__message')!;
        this.updateScoreBoardNames(ultimateBoard);
        this.updateScores(ultimateBoard);
    }

    // ゲームを初期化
    public initializeGame(): void {
        this._currentPlayer = this._players['X'];
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        this.handleAddClick();
    }

    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    public continueGame(): void {
        this.initializeGame();
        this.handleClearBoard();
        if (this._currentPlayer.isCPU) {
            this.difficultyOfCPU();
        }
    }

    // ゲームをリスタート
    public resetGame(): void {
        if (this.ultimateMode) {
            localStorage.removeItem('ticTacToeUltimateState');
        } else {
            localStorage.removeItem('ticTacToeNormalState');
        }
        this.resetScores();
        this.initializeGame();
        this.resetScores();
        this.handleClearBoard();
    }

    // プレイヤー交代
    public switchPlayer(): void {
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            this.difficultyOfCPU();
        }
    }

    // スコアをリセット
    private resetScores(): void {
        console.log("スコアをリセットします")
        this._scores = {
            'X': 0,
            'O': 0
        };
        this.updateScores(this.ultimateMode);
    }

    // スコアボードの更新
    private updateScores(isUltimateBoard: boolean = false): void {
        if (isUltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-score')!.innerText = `${this._scores['X']}`;
            document.getElementById('ultimate-scoreboard__O-score')!.innerText = `${this._scores['O']}`;
        } else {
            document.getElementById('scoreboard__X__score')!.innerText = `${this._scores['X']}`;
            document.getElementById('scoreboard__O__score')!.innerText = `${this._scores['O']}`;
        }
    }

    // スコアボードの名前を初期化
    private updateScoreBoardNames(isUltimateBoard: boolean = false): void {
        if (isUltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-name')!.innerText = this._players['X'].name;
            document.getElementById('ultimate-scoreboard__O-name')!.innerText = this._players['O'].name;
        } else {
            document.getElementById('scoreboard__X__name')!.innerText = this._players['X'].name;
            document.getElementById('scoreboard__O__name')!.innerText = this._players['O'].name;
        }
        this.updatePlayerNamesForm();
    }

    // 名前入力画面から名前だけ変更
    private updatePlayerNamesForm(): void {
        (document.getElementById('name-setting__form__player1') as HTMLInputElement).value = this._players['X'].name;
        (document.getElementById('name-setting__form__player2') as HTMLInputElement).value = this._players['O'].name;
    }

    // クリアボードの条件分け
    private handleClearBoard(): void {
        if (this._board instanceof UltimateBoard) {
            this._board.clearUltimateBoard();
            this._board.miniBoardResult.fill('');
        } else {
            this._board.clearBoard();
        }
    }

    // クリックイベント付与の場合分け
    private handleAddClick(): void {
        if (this.ultimateMode) {
            (this._board as UltimateBoard).ultimateAddClickHandlers();
            (this._board as UltimateBoard).miniBoardResult.fill('');
        } else {
            this._board.addClickHandlers();
        }
    }

    private difficultyOfCPU(): void {
        switch (this._currentPlayer.isCPU) {
            case 'easy':
                this.playEasyCPU();
                break;

            case 'medium':

                break;

            case 'hard':
                this.hardModeCPU();
                break;

            default:
                this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
                break;
        }
    }

    private playEasyCPU(): void {
        if (!this._isCPUThinking) {
            this._isCPUThinking = true;
            this.executeEasyCPUTurn();
        }
    }

    private executeEasyCPUTurn(): void {
        setTimeout(() => {
            if (this._board instanceof UltimateBoard) {
                const ultimateBoard = this._board as UltimateBoard;
                this.ultimateBoardCPU(ultimateBoard);
            } else {
                this.playNormalEasyCPUTurn();
            }

            this._isCPUThinking = false;

            // CPUの手番が終わった後、ゲームの状態をチェック
            if (this._board instanceof UltimateBoard) {
                if (this._board.ultimateCheckWin()) {
                    this.handleEndGame(false, true);
                } else if (this._board.ultimateCheckDraw()) {
                    this.handleEndGame(true, true);
                } else if (this._currentPlayer.isCPU) {
                    // CPUが勝った場合、もう一度CPUの手番にする
                    this.playEasyCPU();
                }
            } else {
                if (this._board.checkWin()) {
                    this.handleEndGame(false);
                } else if (this._board.checkDraw()) {
                    this.handleEndGame(true);
                } else if (this._currentPlayer.isCPU) {
                    this.playEasyCPU();
                }
            }

            this.saveGameStorage();
        }, 1000);
    }

    private ultimateBoardCPU(ultimateBoard: UltimateBoard): void {
        let availableBoards: number[] = [];
        let availableCells: { boardIndex: number, cellIndex: number }[] = [];

        if (ultimateBoard.currentBoardIndex !== null) {
            availableBoards = [ultimateBoard.currentBoardIndex];
        } else {
            availableBoards = ultimateBoard.miniBoardResult
                .map((result, index) => result === '' ? index : -1)
                .filter(index => index !== -1);
        }

        availableBoards.forEach(boardIndex => {
            const miniBoard = ultimateBoard.miniBoards[boardIndex];
            miniBoard.cells.forEach((cell, cellIndex) => {
                if (!cell.mark) {
                    availableCells.push({ boardIndex, cellIndex });
                }
            });
        });

        if (availableCells.length > 0) {
            const randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
            ultimateBoard.ultimateHandleCellClick(randomMove.cellIndex, randomMove.boardIndex);
        }
    }

    private playNormalEasyCPUTurn(): void {
        let emptyCells = this._board.cells
            .map((cell, index) => ({ cellIndex: index, cell }))
            .filter(({ cell }) => !cell.mark);

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this._board.handleCellClick(randomCell.cellIndex);
        }
    }

    private hardModeCPU(): void {
        console.log("ハードモード")
        this._isCPUThinking = true;
        setTimeout(() => {
            const bestMove = this.findBestMove();
            if (bestMove !== -1) {
                this._board.markCell(bestMove, this._currentPlayer.mark);
                if (this.board.checkWin()) {
                    this.handleEndGame(false);
                } else if (this.board.checkDraw()) {
                    this.handleEndGame(true);
                } else {
                    this.switchPlayer();
                }
                this.saveGameStorage();
            }
            this._isCPUThinking = false;
        }, 1000);
    }

    private findBestMove(): number {
        console.log("ファインドベストブーム")
        let bestScore = -Infinity;
        let bestMove = -1;
        const emptyCells = this._board.getEmptyCells();

        for (const move of emptyCells) {
            this.board.cells[move].mark = this._currentPlayer.mark;
            const score = this.minimax(0, -Infinity, Infinity, false);
            this.board.cells[move].mark = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    private minimax(depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
        if (this._board.checkWin()) {
            const winner = isMaximizing ? this._currentPlayer.mark : (this._currentPlayer.mark === 'O' ? 'X' : 'O');
            return isMaximizing ? depth - (this._board.size + 1) ** 2 : (this._board.size ** 2 + 1) - depth;
        } else if (this._board.checkDraw() || depth === this._board.size ** 2) {
            return 0;
        }
        const currentMark = isMaximizing ? this._currentPlayer.mark : (this._currentPlayer.mark === 'O' ? 'X' : 'O');
        const emptyCells = this._board.getEmptyCells();

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of emptyCells) {
                this.board.cells[move].mark = currentMark;
                const score = this.minimax(depth + 1, alpha, beta, false);
                this.board.cells[move].mark = '';
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, maxScore);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of emptyCells) {
                this.board.cells[move].mark = currentMark;
                const score = this.minimax(depth + 1, alpha, beta, true);
                this.board.cells[move].mark = '';
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, minScore);
                if (beta <= alpha) {
                    break;
                }
            }
            return minScore;
        }
    }

    // ゲーム結果の表示、スコアの更新
    public handleEndGame(draw: boolean, isUltimateBoard: boolean = false): void {
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        } else {
            this._scores[this._currentPlayer.mark]++;
            this.updateScores(isUltimateBoard);
            if (!isUltimateBoard) {
                this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            }
        }
        this.saveGameStorage();
    }

    // localStorageに保存
    public saveGameStorage(): void {
        if (this.board) {
            const state = {
                players: this._players,
                currentPlayer: this._currentPlayer,
                scores: {
                    'X': this._scores['X'],
                    'O': this._scores['O']
                },
                isCPU: this._players['O'].isCPU,
                isUltimate: this.ultimateMode,
                board: this.ultimateMode ? (this._board as UltimateBoard).getUltimateBoardState() : this._board.getBoardState(),
            };
            const storageKey = this.ultimateMode ? 'ticTacToeUltimateState' : 'ticTacToeNormalState';
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
    }

    // localStorageからボードとスコアをロード
    private loadPlayBoard(boardSize: number): Board | UltimateBoard {
        console.log("ローカルプレイヤーネーム");
        const normalState = localStorage.getItem('ticTacToeNormalState');
        const ultimateState = localStorage.getItem('ticTacToeUltimateState');
        const boardContainer = document.querySelector('.board__container') as HTMLElement;
        const ultimateBoardContainer = document.querySelector('.ultimate__board__container') as HTMLElement;

        let state = null;

        if (this.ultimateMode && ultimateState) {
            console.log("アルティメットストレージ");
            state = JSON.parse(ultimateState);
        } else if (!this.ultimateMode && normalState) {
            console.log("ノーマルストレージ");
            state = JSON.parse(normalState);
        }
        if (state) {
            this._currentPlayer = state.currentPlayer;
            this._scores = {
                'X': state.scores ? state.scores['X'] : 0,
                'O': state.scores ? state.scores['O'] : 0
            }
            this.ultimateMode = state.isUltimate;
            if (state.isUltimate) {
                console.log("アルティメット・ローカルストレージ");
                const ultimateBoard = new UltimateBoard(boardSize, ultimateBoardContainer, this);
                ultimateBoard.setUltimateBoardState(state.board);
                return ultimateBoard;
            } else {
                console.log("ノーマル・ローカルストレージ");
                const board = new Board(boardSize, boardContainer, this);
                board.setBoardState(state.board);
                return board;
            }
        }

        // デフォルトのボードを返す
        return this.ultimateMode
            ? new UltimateBoard(boardSize, ultimateBoardContainer, this)
            : new Board(boardSize, boardContainer, this);
    }

    // ゲッター
    get players() {
        return this._players;
    }

    get currentPlayer() {
        return this._currentPlayer;
    }

    get board() {
        return this._board;
    }

    get scores() {
        return this._scores;
    }

    get winningMessageTextElement() {
        return this.ultimateMode ? this._ultimateWinningMessageTextElement : this._winningMessageTextElement;
    }

    get isCPUThinking(): boolean {
        return this._isCPUThinking;
    }

    // セッター
    set currentPlayers(player: { name: string, mark: string, isCPU: string | null }) {
        this._currentPlayer = player;
    }

    set board(board: Board | UltimateBoard) {
        this._board = board;
    }
}