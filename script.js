
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

async function fetchLeaderboard() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  return data.sort((a, b) => b.amount - a.amount).slice(0, 5);
}

async function saveScore(name, amount) {
  await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ name, amount })
  });
}

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

async function renderLeaderboard() {
  const leaderboard = await fetchLeaderboard();
  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: $${entry.amount}`;
    leaderboardList.appendChild(li);
  });
}

button.addEventListener("click", async () => {
  const randomMoney = (Math.random() * 1000000).toFixed(2);
  moneyDisplay.textContent = `$${randomMoney}`;
  message.textContent = messages[Math.floor(Math.random() * messages.length)];

  const name = prompt("Enter your name for the leaderboard:");
  if (name) {
    await saveScore(name, randomMoney);
    renderLeaderboard();
  }
});

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
