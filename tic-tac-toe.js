// ボードのO,Xを追跡
let board = ['', '', '', '', '', '', '', '', ''];

// 現在のプレーヤー
let currentPlayer = 'X';

// ゲームが続行中、終了
let isGameActive = true;

// メッセージ要素を取得
const messageElement = document.getElementById('message');

// ボタンエレメントを取得
const buttonElement = document.getElementById('restartButton');

// 勝利時の条件を配列に保存
const winnerConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], 
  [2, 4, 6]
];

// 各セルがクリックされた時コールされる
function makeMove(index) {
  // ボードに空きがない＆ゲームが終わった時、停止
  if (board[index] !== '' || !isGameActive) return;

  // ボードの現在のindexにX、Oを追加
  board[index] = currentPlayer;

  // それぞれのセルの要素にX,Oを追加して画面に表示
  document.getElementById(`cell-${index}`).innerHTML = currentPlayer;

  helperFunction();
}

function helperFunction() {
  // 勝者が決まったらtrue
  let roundWon = false;

  // winnerConditionsをループして勝者を決める
  for(let i = 0; i <= 7; i++) {
    const winCondition = winnerConditions[i];
    // ボードのindexで勝利条件に合ったプレーヤーを探す
    let a = board[winCondition[0]];
    let b = board[winCondition[1]];
    let c = board[winCondition[2]];

    // 合っていなかったらループ継続
    if (a === '' || b === '' || c === '') continue;

    // 合っていたらブレイクしてゲーム終了
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  // 勝者が決まったら勝った方をメッセージエレメントに表示
  if (roundWon) {
    messageElement.innerHTML =  `${currentPlayer} Wins!`;
    isGameActive = false;
    return;
  }

  // 引き分けはDraw
  if (!board.includes('')) {
    messageElement.innerHTML = 'Draw';
    isGameActive = false;
    return;
  }

  // 常にX、Oを入れ替える
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  messageElement.innerHTML = `${currentPlayer}'s Turn`;
}

// ボタンが押されたら全てリセット
function gameRestart() {
  for(let i = 0; i <= 8; i++) {
    document.getElementById(`cell-${i}`).innerHTML = '';
  }
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  messageElement.innerHTML = `X's Turn`;
}


