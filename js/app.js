const PERSON_NAME = "you";

const messages = [
  {
    title: "A little note",
    body: "Ustedes hacen que los días comunes se sientan como celebraciones. Esta página es una pequeña fiesta en su honor, porque compartir cumpleaños con tanto cariño es pura magia.",
  },
  {
    title: "Because of you",
    body: "Sus risas, su bondad y la forma en que siempre están ahí iluminan todo a su alrededor. Son el corazón de cada momento bonito.",
  },
  {
    title: "Remember this",
    body: "Ustedes son amados, celebrados y tienen permiso para brillar tan intensamente como quieran.",
  },
];


const giftBtn = document.getElementById("gift-btn");
const gift = document.getElementById("gift");
const giftScene = document.getElementById("gift-scene");
const partyScene = document.getElementById("party-scene");
const musicToggle = document.getElementById("music-toggle");
const musicLabel = document.getElementById("music-label");
const canvas = document.getElementById("glitter");
const ctx = canvas.getContext("2d");

document.getElementById("greeting-title").textContent =
  `Happy moments, for ${PERSON_NAME}`;

function renderCards(id, items) {
  const root = document.getElementById(id);
  root.innerHTML = items
    .map(
      (item) =>
        `<article class="card"><h3>${item.title}</h3><p>${item.body}</p></article>`
    )
    .join("");
}

renderCards("messages", messages);

const particles = [];
let burstUntil = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnGlitter(count, burst) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: burst ? canvas.width / 2 + (Math.random() - 0.5) * 180 : Math.random() * canvas.width,
      y: burst ? canvas.height * 0.48 : -10,
      vx: (Math.random() - 0.5) * (burst ? 8 : 1.4),
      vy: burst ? Math.random() * -7 - 1 : Math.random() * 1.4 + 0.4,
      size: Math.random() * 3.2 + 1,
      life: 1,
      hue: [320, 45, 175, 280, 0][Math.floor(Math.random() * 5)],
    });
  }
}

function drawGlitter(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (now < burstUntil) spawnGlitter(10, true);
  if (partyScene.hidden === false && Math.random() < 0.35) spawnGlitter(2, false);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.life -= 0.006;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = `hsl(${p.hue} 100% 72%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    if (p.life <= 0 || p.y > canvas.height + 20) particles.splice(index, 1);
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawGlitter);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(drawGlitter);

const playlist = [
  {
    file: "song-01.m4a",
    title: "Happy Birthday — Bongo Cat",
  },
  {
    file: "song-02.m4a",
    title: "Happy Birthday — Chipmunks",
  },
];

const backgrounds = ["img_fondo/01.jpg", "img_fondo/02.jpg", "img_fondo/03.jpg"];
const bgA = document.getElementById("bg-a");
const bgB = document.getElementById("bg-b");
let bgIndex = 0;
let showingA = true;

function setSlideImage(el, src) {
  el.style.backgroundImage = `url("${src}")`;
}

function nextBackground() {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  const incoming = showingA ? bgB : bgA;
  const outgoing = showingA ? bgA : bgB;
  setSlideImage(incoming, backgrounds[bgIndex]);
  incoming.classList.add("is-active");
  outgoing.classList.remove("is-active");
  showingA = !showingA;
}

setSlideImage(bgA, backgrounds[0]);
window.setInterval(nextBackground, 7000);

const musicNote = document.querySelector(".music-note");
const player = new Audio();
player.preload = "auto";
player.volume = 0.72;

let trackIndex = 0;
let musicOn = false;

function loadTrack(index) {
  trackIndex = (index + playlist.length) % playlist.length;
  const track = playlist[trackIndex];
  player.src = `songs/${encodeURIComponent(track.file)}`;
  if (musicNote) {
    musicNote.textContent = `Now playing: ${track.title}`;
  }
}

function setMusicUi(playing) {
  musicOn = playing;
  musicToggle.classList.toggle("is-paused", !playing);
  musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
  musicLabel.textContent = playing ? "Pause music" : "Play music";
}

function startMusic() {
  if (musicOn) return;
  if (!player.src) loadTrack(0);
  const playAttempt = player.play();
  if (playAttempt) {
    playAttempt.then(() => setMusicUi(true)).catch(() => setMusicUi(false));
  } else {
    setMusicUi(true);
  }
}

function stopMusic() {
  player.pause();
  setMusicUi(false);
}

player.addEventListener("ended", () => {
  loadTrack(trackIndex + 1);
  if (musicOn) {
    player.play().catch(() => setMusicUi(false));
  }
});

loadTrack(0);

giftBtn.addEventListener("click", () => {
  gift.classList.add("is-open");
  burstUntil = performance.now() + 900;
  spawnGlitter(80, true);
  startMusic();
  window.setTimeout(() => {
    giftScene.remove();
    partyScene.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 850);
});

musicToggle.addEventListener("click", () => {
  if (musicOn) stopMusic();
  else startMusic();
});
