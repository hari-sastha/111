const icons = { rock: '🪨', paper: '📄', scissors: '✂️' };
const beats  = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
let playerScore = 0, cpuScore = 0;

function play(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const cpuChoice = choices[Math.floor(Math.random() * 3)];

  document.getElementById('playerIcon').textContent = icons[playerChoice];
  document.getElementById('cpuIcon').textContent    = icons[cpuChoice];

  const resultEl = document.getElementById('result');

  if (playerChoice === cpuChoice) {
    resultEl.textContent = "It's a Draw!";
    resultEl.style.color = '#f39c12';
  } else if (beats[playerChoice] === cpuChoice) {
    playerScore++;
    document.getElementById('playerScore').textContent = playerScore;
    resultEl.textContent = 'You Win! 🎉';
    resultEl.style.color = '#2ecc71';
  } else {
    cpuScore++;
    document.getElementById('cpuScore').textContent = cpuScore;
    resultEl.textContent = 'CPU Wins!';
    resultEl.style.color = '#e94560';
  }
}

function resetGame() {
  playerScore = 0; cpuScore = 0;
  document.getElementById('playerScore').textContent = 0;
  document.getElementById('cpuScore').textContent    = 0;
  document.getElementById('playerIcon').textContent  = '❓';
  document.getElementById('cpuIcon').textContent     = '❓';
  document.getElementById('result').textContent      = 'Choose your move!';
  document.getElementById('result').style.color      = '#fff';
}