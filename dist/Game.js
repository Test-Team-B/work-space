import { Board } from "./Board.js";
import { UltimateBoard } from "./ultimateBoard.js";
export class Game {
    constructor(playerXName, playerOName, boardSize, isCPUMode = null, ultimateBoard = false) {
        this._isCPUThinking = false;
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
        this._winningMessageTextElement = document.getElementById('info__message');
        this._ultimateWinningMessageTextElement = document.getElementById('ultimate-info__message');
        this.updateScoreBoardNames(ultimateBoard);
        this.updateScores(ultimateBoard);
    }
    // ゲームを初期化
    initializeGame() {
        this._winningMessageTextElement.innerText = `${this.currentPlayer.name}'s Turn`;
        this.handleAddClick();
    }
    // ゲームだけ初期化,スコアはそのまま,ターン表示初期化
    continueGame() {
        this.initializeGame();
        this.handleClearBoard();
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        }
    }
    // ゲームをリスタート
    resetGame() {
        this.resetScores();
        this.initializeGame();
        this.handleClearBoard();
    }
    // プレイヤー交代
    switchPlayer() {
        this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
        if (this._currentPlayer.isCPU) {
            this.playCPUTurn();
        }
    }
    // スコアをリセット
    resetScores() {
        this._scores = {
            'X': 0,
            'O': 0
        };
    }
    // スコアボードの更新
    updateScores(isUltimateBoard = false) {
        if (isUltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-score').innerText = `${this._scores['X']}`;
            document.getElementById('ultimate-scoreboard__O-score').innerText = `${this._scores['O']}`;
        }
        else {
            document.getElementById('scoreboard__X__score').innerText = `${this._scores['X']}`;
            document.getElementById('scoreboard__O__score').innerText = `${this._scores['O']}`;
        }
    }
    // スコアボードの名前を初期化
    updateScoreBoardNames(isUltimateBoard = false) {
        if (isUltimateBoard) {
            document.getElementById('ultimate-scoreboard__X-name').innerText = this._players['X'].name;
            document.getElementById('ultimate-scoreboard__O-name').innerText = this._players['O'].name;
        }
        else {
            document.getElementById('scoreboard__X__name').innerText = this._players['X'].name;
            document.getElementById('scoreboard__O__name').innerText = this._players['O'].name;
        }
        this.updatePlayerNamesForm();
    }
    // 名前入力画面から名前だけ変更
    updatePlayerNamesForm() {
        document.getElementById('name-setting__form__player1').value = this._players['X'].name;
        document.getElementById('name-setting__form__player2').value = this._players['O'].name;
    }
    // クリアボードの条件分け
    handleClearBoard() {
        if (this._board instanceof UltimateBoard) {
            this._board.clearUltimateBoard();
            this._board.miniBoardResult.fill('');
        }
        else {
            this._board.clearBoard();
        }
    }
    // クリックイベント付与の場合分け
    handleAddClick() {
        if (this.ultimateMode) {
            this._board.ultimateAddClickHandlers();
            this._board.miniBoardResult.fill('');
        }
        else {
            this._board.addClickHandlers();
        }
    }
    playCPUTurn() {
        switch (this._currentPlayer.isCPU) {
            case 'easy':
                this.playEasyCPU();
                break;
            case 'medium':
                break;
            case 'hard':
                this.playHardCPU();
                break;
            default:
                this._currentPlayer = this._currentPlayer.mark === 'X' ? this._players['O'] : this._players['X'];
                break;
        }
    }
    playEasyCPU() {
        this._isCPUThinking = true;
        setTimeout(() => {
            let emptyCells = [];
            if (this._board instanceof UltimateBoard) {
                const boardIndex = this._board.currentBoardIndex !== null ? this._board.currentBoardIndex : Math.floor(Math.random() * this._board.miniBoards.length);
                this._board.miniBoards[boardIndex].cells.forEach((cell, cellIndex) => {
                    if (!cell.mark) {
                        emptyCells.push({ boardIndex, cellIndex, cell });
                    }
                });
            }
            else {
                emptyCells = this._board.cells
                    .map((cell, index) => ({ boardIndex: 0, cellIndex: index, cell }))
                    .filter(({ cell }) => !cell.mark);
            }
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const { boardIndex, cellIndex } = randomCell;
                if (this._board instanceof UltimateBoard) {
                    this._board.ultimateHandleCellClick(cellIndex, boardIndex);
                }
                else {
                    this.switchPlayer();
                }
                this.saveGameStorage();
            }
            this._isCPUThinking = false;
        }, 1000);
    }
    playHardCPU() {
        console.log("ハードモード");
        this._isCPUThinking = true;
        setTimeout(() => {
            const bestMove = this.findBestMove();
            if (bestMove !== -1) {
                this._board.markCell(bestMove, this._currentPlayer.mark);
                if (this.board.checkWin()) {
                    this.handleEndGame(false);
                }
                else if (this.board.checkDraw()) {
                    this.handleEndGame(true);
                }
                else {
                    this.switchPlayer();
                }
                this.saveGameStorage();
            }
            this._isCPUThinking = false;
        }, 1000);
    }
    findBestMove() {
        console.log("ファインドベストブーム");
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
    minimax(depth, alpha, beta, isMaximizing) {
        if (this._board.checkWin()) {
            const winner = isMaximizing ? this._currentPlayer.mark : (this._currentPlayer.mark === 'O' ? 'X' : 'O');
            return isMaximizing ? depth - (this._board.size + 1) ** 2 : (this._board.size ** 2 + 1) - depth;
        }
        else if (this._board.checkDraw() || depth === this._board.size ** 2) {
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
        }
        else {
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
    handleEndGame(draw, isUltimateBoard = false) {
        if (draw) {
            this.winningMessageTextElement.innerText = 'Draw!';
        }
        else {
            this._scores[this._currentPlayer.mark]++;
            this.updateScores(isUltimateBoard);
            if (!isUltimateBoard) {
                this.winningMessageTextElement.innerText = `${this._currentPlayer.name} Wins!`;
            }
        }
        this.saveGameStorage();
    }
    // localStorageに保存
    saveGameStorage() {
        if (this.board) {
            const state = {
                players: this._players,
                currentPlayer: this._currentPlayer,
                scores: {
                    'X': this._scores['X'],
                    'O': this._scores['O']
                },
                isUltimate: this.ultimateMode,
                board: this.ultimateMode ? this._board.getUltimateBoardState() : this._board.getBoardState(),
            };
            const storageKey = this.ultimateMode ? 'ticTacToeUltimateState' : 'ticTacToeNormalState';
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
    }
    // localStorageからボードとスコアをロード
    loadPlayBoard(boardSize) {
        console.log("ローカルプレイヤーネーム");
        const normalState = localStorage.getItem('ticTacToeNormalState');
        const ultimateState = localStorage.getItem('ticTacToeUltimateState');
        const boardContainer = document.querySelector('.board__container');
        const ultimateBoardContainer = document.querySelector('.ultimate__board__container');
        let state = null;
        if (this.ultimateMode && ultimateState) {
            console.log("アルティメットストレージ");
            state = JSON.parse(ultimateState);
        }
        else if (!this.ultimateMode && normalState) {
            console.log("ノーマルストレージ");
            state = JSON.parse(normalState);
        }
        if (state) {
            console.log(state);
            this._scores = {
                'X': state.scores ? state.scores['X'] : 0,
                'O': state.scores ? state.scores['O'] : 0
            };
            console.log(this._scores);
            this.ultimateMode = state.isUltimate;
            if (state.isUltimate) {
                console.log("アルティメット・ローカルストレージ");
                const ultimateBoard = new UltimateBoard(boardSize, ultimateBoardContainer, this);
                ultimateBoard.setUltimateBoardState(state.board);
                return ultimateBoard;
            }
            else {
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
    get isCPUThinking() {
        return this._isCPUThinking;
    }
    // セッター
    set currentPlayers(player) {
        this._currentPlayer = player;
    }
    set board(board) {
        this._board = board;
    }
}
