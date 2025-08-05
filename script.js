const moneyDisplay = document.getElementById('money-display');
const message = document.getElementById('message');
const button = document.getElementById('generate-btn');
const leaderboardList = document.getElementById('leaderboard');
const shareTwitterBtn = document.getElementById('share-twitter');

const SUPABASE_URL = "https://cylibyttobpzhxlwfrrw.supabase.co"; // Replace with your URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bGlieXR0b2Jwemh4bHdmcnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg4MjksImV4cCI6MjA2OTU2NDgyOX0.nfbI_7sBzW5FrqVa_VvX7YE25NEAy2QqU11_02-DIXo"; // Replace with your anon key

const messages = [
  "You're richer than yesterday!",
  "Don't quit your day job yet.",
  "Buy yourself a sandwich!",
  "Enough for a coffee… maybe.",
  "You're now richer than your cat.",
  "Jeff Bezos is shaking (not really).",
  "Go wild! Or just pay your bills."
];

// Fetch leaderboard
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

// Save new score
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

// Render leaderboard
async function renderLeaderboard() {
  const leaderboard = await fetchLeaderboard();
  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: $${entry.amount}`;
    leaderboardList.appendChild(li);
  });
}

// Button click handler
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

// Share on Twitter
shareTwitterBtn.addEventListener('click', () => {
  const text = `I just made ${moneyDisplay.textContent} today on "How Rich Am I Today?" 💸 Try it here:`;
  const url = "https://how-rich-am-i.vercel.app"; // Your deployed URL
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
});

// Initial load
renderLeaderboard();
