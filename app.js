const wedding = window.WEDDING;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
const content = document.querySelector("#content");
const openButton = document.querySelector("#open-invitation");
const audio = document.querySelector("#wedding-audio");
const musicButton = document.querySelector("#music-toggle");
const audioStatus = document.querySelector("#audio-status");
const preview =
  ["localhost", "127.0.0.1", "[::1]", ""].includes(location.hostname) &&
  new URLSearchParams(location.search).get("preview") === "1";

document.querySelectorAll("[data-field]").forEach((element) => {
  element.textContent = wedding[element.dataset.field];
});
document.querySelectorAll("[data-photo]").forEach((image) => {
  image.src = wedding.photos[image.dataset.photo];
});
const date = new Date(wedding.date);
const parts = Object.fromEntries(
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "long",
  })
    .formatToParts(date)
    .map((part) => [part.type, part.value]),
);
parts.time = `${parts.hour}:${parts.minute}`;
parts.weekday = parts.weekday.toLocaleUpperCase("vi-VN");
document.querySelectorAll("[data-date]").forEach((element) => {
  element.textContent = parts[element.dataset.date];
});
function setOptional(element, value) {
  element.hidden = !value && !preview;
  element.classList.toggle("missing", !value);
  element.textContent = `${element.dataset.label ? element.dataset.label + ": " : ""}${value || "Chưa điền"}`;
}
document
  .querySelectorAll("[data-optional]")
  .forEach((element) =>
    setOptional(element, wedding[element.dataset.optional]),
  );
["groom", "bride"].forEach((side) => {
  document.querySelector(`#${side}-family`).hidden =
    !preview && !wedding[`${side}Father`] && !wedding[`${side}Mother`];
});
const reception = wedding.reception;
document.querySelector("#reception-card").hidden =
  !preview && !(reception.time && reception.address);
document
  .querySelectorAll("[data-reception]")
  .forEach((element) =>
    setOptional(element, reception[element.dataset.reception]),
  );
if (reception.mapUrl && reception.time && reception.address) {
  document.querySelector("#reception-map").href = reception.mapUrl;
  document.querySelector("#reception-map").hidden = false;
}
document.querySelector("#map-link").href = wedding.mapUrl;
audio.src = wedding.audio;
audio.volume = 0.45;

function startReveals() {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  document.body.classList.add("js-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}
let audioMessageTimer;
async function playMusic() {
  try {
    await audio.play();
    audioStatus.textContent = "";
  } catch {
    audioStatus.textContent = "Chạm nút nốt nhạc để thử phát nhạc nền.";
    clearTimeout(audioMessageTimer);
    audioMessageTimer = setTimeout(() => {
      audioStatus.textContent = "";
    }, 5000);
  }
}
function updateMusicButton() {
  const playing = !audio.paused;
  musicButton.classList.toggle("playing", playing);
  musicButton.setAttribute("aria-pressed", String(playing));
  musicButton.setAttribute(
    "aria-label",
    playing ? "Tắt nhạc nền" : "Bật nhạc nền",
  );
}
audio.addEventListener("play", updateMusicButton);
audio.addEventListener("pause", updateMusicButton);
musicButton.addEventListener("click", () => {
  if (audio.paused) playMusic();
  else audio.pause();
});
function finishOpening() {
  hero.classList.remove("is-opening", "is-closed");
  openButton.hidden = true;
  content.inert = false;
  document.querySelector("footer").inert = false;
  document.body.classList.remove("cover-active");
  musicButton.hidden = false;
  startReveals();
}
if (reducedMotion.matches) {
  finishOpening();
} else {
  hero.classList.add("is-closed");
  openButton.hidden = false;
  content.inert = true;
  document.querySelector("footer").inert = true;
  document.body.classList.add("cover-active");
}
openButton.addEventListener(
  "click",
  () => {
    openButton.disabled = true;
    playMusic();
    hero.classList.add("is-opening");
    hero.classList.remove("is-closed");
    setTimeout(
      () => {
        finishOpening();
        content.focus({ preventScroll: true });
      },
      reducedMotion.matches ? 0 : 1800,
    );
  },
  { once: true },
);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) finishOpening();
});

const weddingTime = date.getTime();
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  const values = {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining / 3600) % 24,
    minutes: Math.floor(remaining / 60) % 60,
    seconds: remaining % 60,
  };
  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent = String(value).padStart(2, "0");
  });
  if (!remaining) {
    document.querySelector("#countdown-title").textContent =
      "Mãi bên nhau, từ hôm nay";
    document.querySelector("#countdown-caption").textContent =
      "Cảm ơn bạn đã cùng chúng mình lưu giữ ngày hạnh phúc.";
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

const lightbox = document.querySelector("#lightbox");
const galleryButtons = [...document.querySelectorAll("[data-gallery]")];
const target = document.querySelector("#lightbox-image");
const incoming = document.createElement("img");
incoming.id = "lightbox-incoming";
incoming.alt = "";
incoming.setAttribute("aria-hidden", "true");
target.after(incoming);
const caption = document.querySelector("#lightbox-caption");
let selectedPhoto = 0;
let photoRequest = 0;
let photoAnimation;
async function showPhoto(index) {
  selectedPhoto = (index + galleryButtons.length) % galleryButtons.length;
  const current = selectedPhoto;
  const request = ++photoRequest;
  const source = galleryButtons[current].querySelector("img");
  const loaded = new Image();
  loaded.src = source.src;
  try {
    await loaded.decode();
    if (request !== photoRequest) return;
    photoAnimation?.cancel();
    if (lightbox.open && target.hasAttribute("src") && !reducedMotion.matches) {
      incoming.src = loaded.src;
      await incoming.decode();
      if (request !== photoRequest) return;
      photoAnimation = incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 220,
        fill: "forwards",
      });
      await photoAnimation.finished;
    }
    if (request !== photoRequest) return;
    target.src = loaded.src;
    target.alt = source.alt;
    caption.textContent = `${current + 1} / ${galleryButtons.length} — ${source.alt}`;
    photoAnimation?.cancel();
    if (!lightbox.open) {
      lightbox.showModal();
      document.body.classList.add("modal-open");
    }
  } catch (error) {
    if (request === photoRequest && error.name !== "AbortError") {
      caption.textContent = "Không tải được ảnh. Vui lòng thử ảnh khác.";
    }
  }
}
galleryButtons.forEach((button, index) =>
  button.addEventListener("click", () => showPhoto(index)),
);
document
  .querySelector(".lightbox-close")
  .addEventListener("click", () => lightbox.close());
document
  .querySelector(".lightbox-prev")
  .addEventListener("click", () => showPhoto(selectedPhoto - 1));
document
  .querySelector(".lightbox-next")
  .addEventListener("click", () => showPhoto(selectedPhoto + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  photoRequest += 1;
  photoAnimation?.cancel();
  document.body.classList.remove("modal-open");
  galleryButtons[selectedPhoto].focus({ preventScroll: true });
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(selectedPhoto + (event.key === "ArrowLeft" ? -1 : 1));
  }
});
