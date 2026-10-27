const wedding = window.WEDDING;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
const content = document.querySelector("#content");
const openButton = document.querySelector("#open-invitation");
const audio = document.querySelector("#wedding-audio");
const musicButton = document.querySelector("#music-toggle");
const audioStatus = document.querySelector("#audio-status");

document.querySelectorAll("[data-field]").forEach((element) => {
  element.textContent = wedding[element.dataset.field];
});
document.querySelectorAll("[data-photo]").forEach((image) => {
  image.src = wedding.photos[image.dataset.photo];
});
// Decode the configured cover photos before the paper starts to move.
const coverPhotosReady = Promise.allSettled(
  [...document.querySelectorAll(".photo-frame img, .envelope-flowers")].map(
    (image) => image.decode(),
  ),
);
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
parts.monthName = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Ho_Chi_Minh",
  month: "long",
}).format(date);
document.querySelectorAll("[data-date]").forEach((element) => {
  element.textContent = parts[element.dataset.date];
});
function setOptional(element, value) {
  element.hidden = false;
  element.classList.toggle("missing", !value);
  element.textContent = `${element.dataset.label ? element.dataset.label + ": " : ""}${value || "Chưa cung cấp"}`;
}
document
  .querySelectorAll("[data-optional]")
  .forEach((element) =>
    setOptional(element, wedding[element.dataset.optional]),
  );
["groom", "bride"].forEach((side) => {
  document.querySelector(`#${side}-family`).hidden = false;
});
const reception = wedding.reception;
document.querySelector("#reception-card").hidden = false;
document
  .querySelectorAll("[data-reception]")
  .forEach((element) =>
    setOptional(element, reception[element.dataset.reception]),
  );
if (reception.mapUrl) {
  document.querySelector("#reception-map").href = reception.mapUrl;
  document.querySelector("#reception-map").hidden = false;
  document.querySelector("#reception-map-placeholder").hidden = true;
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
    .forEach((element) => {
      if (!element.closest(".families")) observer.observe(element);
    });
  const familyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal").forEach((element) => {
            element.classList.add("visible");
          });
          familyObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px 64px 0px" },
  );
  familyObserver.observe(document.querySelector(".families"));
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
let openingTimer;
let opened = false;
function finishOpening() {
  if (opened) return;
  opened = true;
  clearTimeout(openingTimer);
  hero.classList.add("is-open");
  hero.classList.remove("is-opening");
  hero.removeAttribute("aria-busy");
  openButton.setAttribute("aria-expanded", "true");
  openButton.hidden = true;
  content.inert = false;
  document.querySelector("footer").inert = false;
  document.body.classList.remove("cover-active");
  document.body.classList.add("invitation-open");
  musicButton.hidden = false;
  startReveals();
  content.focus({ preventScroll: true });
}
openButton.hidden = false;
content.inert = true;
document.querySelector("footer").inert = true;
document.body.classList.add("cover-active");
openButton.addEventListener(
  "click",
  async () => {
    openButton.disabled = true;
    hero.setAttribute("aria-busy", "true");
    playMusic();
    await coverPhotosReady;
    hero.classList.add("is-open", "is-opening");
    if (reducedMotion.matches) finishOpening();
    else openingTimer = setTimeout(finishOpening, 2400);
  },
  { once: true },
);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches && hero.classList.contains("is-opening")) {
    finishOpening();
  }
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
    const element = document.getElementById(id);
    const nextValue = String(value).padStart(2, "0");
    if (element.textContent !== nextValue) element.textContent = nextValue;
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

const albumGrid = document.querySelector(".album-grid");
const galleryButtons = wedding.album.map((src, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "album-photo reveal reveal-zoom";
  button.setAttribute("aria-label", `Xem ảnh cưới ${index + 1}`);
  const image = document.createElement("img");
  image.src = src;
  image.alt = `Ảnh cưới ${index + 1}`;
  image.loading = "lazy";
  button.append(image);
  albumGrid.append(button);
  return button;
});
document.querySelector("#album").hidden = galleryButtons.length === 0;

const lightbox = document.querySelector("#lightbox");
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
  if (!galleryButtons.length) return;
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
