const moneyDisplay = document.getElementById('money-display');
const message = document.getElementById('message');
const button = document.getElementById('generate-btn');
const leaderboardList = document.getElementById('leaderboard');
const shareTwitterBtn = document.getElementById('share-twitter');

const messages = [
  "You're richer than yesterday!",
  "Don't quit your day job yet.",
  "Buy yourself a sandwich!",
  "Enough for a coffee… maybe.",
  "You're now richer than your cat.",
  "Jeff Bezos is shaking (not really).",
  "Go wild! Or just pay your bills."
];

// Load leaderboard from localStorage
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Display leaderboard
function renderLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: $${entry.amount}`;
      leaderboardList.appendChild(li);
    });
}

renderLeaderboard();

button.addEventListener('click', () => {
  const randomMoney = (Math.random() * 1000000).toFixed(2);
  moneyDisplay.textContent = `$${randomMoney}`;
  message.textContent = messages[Math.floor(Math.random() * messages.length)];

  const name = prompt("Enter your name for the leaderboard:");
  if (name) {
    leaderboard.push({ name, amount: randomMoney });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();
  }
});

shareTwitterBtn.addEventListener('click', () => {
  const text = `I just made ${moneyDisplay.textContent} today on "How Rich Am I Today?" 💸 Try it here:`;
  const url = "https://how-rich-am-i.vercel.app"; // Replace with your deployed URL
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
});
