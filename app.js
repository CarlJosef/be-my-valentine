/* app.js
   Tweak notes:
   - Want MORE hearts? Decrease HEART_SPAWN_INTERVAL_MS and/or increase HEART_MAX_ON_SCREEN.
   - Want LESS hearts? Increase HEART_SPAWN_INTERVAL_MS and/or decrease HEART_MAX_ON_SCREEN.
*/

"use strict";

// ==========================
//  CONFIG
// ==========================

const HEART_SYMBOLS = ["❤️", "💙", "💚"];

// Lower = more hearts. Raise this number to reduce hearts.
const HEART_SPAWN_INTERVAL_MS = 800;

// Hard cap to avoid performance issues on slower devices.
const HEART_MAX_ON_SCREEN = 25;

// ==========================
//  ACCESSIBILITY
// ==========================

const prefersReducedMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

// ==========================
//  BACKGROUND HEARTS
// ==========================

function getHeartCount() {
  return document.getElementsByClassName("heart").length;
}

function spawnHeart() {
  if (prefersReducedMotion) return;
  if (getHeartCount() >= HEART_MAX_ON_SCREEN) return;

  const heart = document.createElement("div");
  heart.className = "heart";

  const symbol =
    HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
  heart.textContent = symbol;

  heart.style.left = `${Math.random() * 100}vw`;

  const size = 16 + Math.random() * 18;
  heart.style.fontSize = `${size}px`;

  const duration = 4 + Math.random() * 4;
  heart.style.animationDuration = `${duration}s`;

  document.body.appendChild(heart);

  window.setTimeout(() => heart.remove(), (duration + 2) * 1000);
}

if (!prefersReducedMotion) {
  window.setInterval(spawnHeart, HEART_SPAWN_INTERVAL_MS);
}

// ==========================
//  DOM REFERENCES
// ==========================

const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const questionEl = document.getElementById("questionText");

const acceptedTemplate = document.getElementById("acceptedTemplate");

// Guard: public repo resilience
const requiredOk =
  envelope && letter && noBtn && yesBtn && questionEl && acceptedTemplate;

if (!requiredOk) {
  // eslint-disable-next-line no-console
  console.warn(
    "Valentine app: Missing required DOM elements. Check IDs in index.html.",
  );
}

// ==========================
//  TYPEWRITER EFFECT
// ==========================

function typeText(element, text, speed = 35) {
  if (!element) return;

  element.textContent = "";
  let i = 0;

  const intervalId = window.setInterval(() => {
    element.textContent += text[i];
    i += 1;

    if (i >= text.length) {
      window.clearInterval(intervalId);
    }
  }, speed);
}

// Cache original question text for re-type on open
const questionFullText = questionEl?.textContent?.trim() ?? "";

// ==========================
//  ENVELOPE OPEN
// ==========================

let envelopeOpened = false;

function openEnvelope() {
  if (!envelope || envelopeOpened) return;

  envelopeOpened = true;
  envelope.classList.add("open");
  envelope.setAttribute("aria-expanded", "true");

  // ✅ Add this:
  document.body.classList.add("opened");

  if (questionEl && questionFullText) {
    window.setTimeout(() => {
      typeText(questionEl, questionFullText, 35);
    }, 600);
  }
}

envelope?.addEventListener("click", openEnvelope);

envelope?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openEnvelope();
  }
});

// ==========================
//  "NO" BUTTON ESCAPES
// ==========================

function moveButton() {
  if (!noBtn) return;

  // Detach to body the first time so it can escape the envelope container
  if (!noBtn.dataset.detached) {
    document.body.appendChild(noBtn);
    noBtn.dataset.detached = "true";
  }

  noBtn.style.position = "fixed";
  noBtn.style.zIndex = "9999";

  const padding = 20;
  const maxX = Math.max(0, window.innerWidth - noBtn.offsetWidth - padding);
  const maxY = Math.max(0, window.innerHeight - noBtn.offsetHeight - padding);

  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;
}

noBtn?.addEventListener("pointerenter", moveButton);
noBtn?.addEventListener("touchstart", moveButton, { passive: true });

// ==========================
//  "YES" BUTTON – ACCEPT (NO innerHTML)
// ==========================

function renderAcceptedState() {
  if (!letter || !(acceptedTemplate instanceof HTMLTemplateElement)) return;

  const fragment = acceptedTemplate.content.cloneNode(true);

  // Replace letter contents safely (no HTML parsing)
  letter.replaceChildren(fragment);

  // Heart burst (still respects reduced motion + cap)
  for (let i = 0; i < 20; i += 1) {
    spawnHeart();
  }
}

yesBtn?.addEventListener("click", renderAcceptedState);
