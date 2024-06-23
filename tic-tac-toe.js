// 新しく仮で変更したところは"Changed"とコメントを打ってあります。

// ボードのO,Xを追跡
let board = ['', '', '', '', '', '', '', '', ''];

// 現在のプレーヤー
let currentPlayer = 'X';

// ゲームが続行中、終了
let isGameActive = true;


// 要素を取得
const messageElement = document.getElementById('info__message');
const btnStart = document.getElementById('info__btn__start'); 
const btnReset = document.getElementById('info__btn__reset');// changed
const btnContinue = document.getElementById('info__btn__continue'); // changed
const btnSubmit = document.getElementById('name-setting__form__submit'); // changed
const scoreX = document.getElementById('scoreboard__X__score'); // changed
const scoreY = document.getElementById('scoreboard__O__score'); // changed
const nameBoard = document.getElementById('name-setting'); // changed
const player1 = document.getElementById('scoreboard__X__name'); // changed
const player2 = document.getElementById('scoreboard__O__name'); // changed

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
  document.getElementById(`board__container__cell-${index}`).innerHTML = currentPlayer; // changed

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
    let winner = document.getElementById(`scoreboard__${currentPlayer}__score`); // changed
    winner.innerHTML = (parseInt(winner.innerHTML) + 1).toString(); // changed
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
    document.getElementById(`board__container__cell-${i}`).innerHTML = ''; // changed
  }
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  messageElement.innerHTML = `X's Turn`;
}


// 今回のHTML、CSSの動きを見るために、ベースのJSファイルを仮で変更しました。ただ動きを確認するだけなので、効率性とか可読性とかは全く考えていません。
// とりあえず各要素にeventListerを付けてあります。

// スタートボタンが押された時
btnStart.addEventListener('click', function() { // changed
  // name-setting要素を表示
  nameBoard.classList.remove('d-none');
  nameBoard.classList.add('d-flex');

  const form = document.querySelector('form');
  form.addEventListener('click', (event)=>{
    event.preventDefault();

    // フォームに入力された各名前を取得
    const player1Input = document.getElementById('name-setting__form__player1').value.trim().toLowerCase();
    const player2Input = document.getElementById('name-setting__form__player2').value.trim().toLowerCase();
    if (player1Input == '') player1Input = 'player1';
    if (player2Input == '') player2Input = 'player2';
    
    // 各プレーヤーの名前を初期化して新しい名前を登録
    player1.innerHTML = '';
    player2.innerHTML = '';

    player1.innerHTML = player1Input;
    player2.innerHTML = player2Input;
    
  })
});

// リセットボタンが押された時
btnReset.addEventListener('click', function() { // changed
  // セル、登録された名前、scoreが全てリセット
  gameRestart();
  player1.innerHTML = '';
  player2.innerHTML = '';
  player1.innerHTML = 'player1';
  player2.innerHTML = 'player2';

  scoreX.innerHTML = '';
  scoreX.innerHTML = '0';
  scoreY.innerHTML = '';
  scoreY.innerHTML = '0';
});

// コンテニューボタンが押された時
btnContinue.addEventListener('click', gameRestart); // changed

// game start が押された時、name-settingを非表示にする
btnSubmit.addEventListener('click', function() {
  nameBoard.classList.remove('d-flex');
  nameBoard.classList.add('d-none');
});

