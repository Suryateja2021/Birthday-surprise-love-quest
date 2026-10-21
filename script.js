(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const intro = $("#intro-screen");
  const main = $("#main-content");
  const openButton = $("#open-surprise");
  const music = $("#background-music");
  const musicToggle = $("#music-toggle");
  const musicIcon = $("#music-icon");
  const toast = $("#toast");
  let toastTimer;
  let musicWasAttempted = false;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function createHearts(count = 18) {
    const container = $("#heart-rain");
    const symbols = ["♥", "♡", "✦"];
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "falling-heart";
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${12 + Math.random() * 22}px`;
      heart.style.opacity = `${0.35 + Math.random() * 0.6}`;
      heart.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
      heart.style.animationDuration = `${3.5 + Math.random() * 4}s`;
      container.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
  }

  async function toggleMusic() {
    if (!music) return;
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-label", "Pause background music");
        musicIcon.textContent = "♫";
        musicWasAttempted = true;
      } catch (error) {
        showToast("Add your music file as assets/music.mp3 to hear your song 💗");
      }
    } else {
      music.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-label", "Play background music");
      musicIcon.textContent = "♫";
    }
  }

  musicToggle.addEventListener("click", toggleMusic);

  openButton.addEventListener("click", async () => {
    intro.classList.add("leaving");
    setTimeout(() => {
      intro.classList.add("hidden");
      main.classList.remove("hidden");
      document.body.classList.add("has-opened");
      window.scrollTo({ top: 0, behavior: "instant" });
      initRevealObserver();
      createHearts(30);
    }, 550);

    // Browsers allow music playback after this user gesture. Missing files are handled quietly.
    if (!musicWasAttempted && music) {
      try {
        await music.play();
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-label", "Pause background music");
      } catch (error) {
        // The visitor can use the visible music button after adding assets/music.mp3.
      }
    }
  });

  // Mobile navigation
  const menuToggle = $("#menu-toggle");
  const nav = $("#site-nav");
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });
  $$("a", nav).forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }));

  // Reveal sections on scroll
  let revealObserver;
  function initRevealObserver() {
    const targets = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-visible"));
      return;
    }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(el => {
      if (!el.classList.contains("is-visible")) revealObserver.observe(el);
    });
  }

  // Photos and lightbox
  const photoCards = $$(".photo-card");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  let currentPhotoIndex = 0;
  const photoData = photoCards.map(card => ({
    src: card.dataset.photo,
    caption: card.dataset.caption,
    alt: $("img", card)?.alt || "A favorite memory"
  }));

  // If an image file is missing, retain the layout and show a friendly placeholder.
  $$("img").forEach(img => {
    img.addEventListener("error", () => {
      img.dataset.missing = "true";
      img.alt = "Add your photo file here";
      img.style.objectFit = "contain";
      img.style.padding = "18px";
      img.style.color = "#a36a80";
      // The image element itself cannot display fallback text consistently in every browser.
      // The adjacent caption and setup instructions remain visible.
    });
  });

  function showPhoto(index) {
    if (!photoData.length) return;
    currentPhotoIndex = (index + photoData.length) % photoData.length;
    const photo = photoData[currentPhotoIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.caption;
  }
  photoCards.forEach((card, index) => card.addEventListener("click", () => {
    showPhoto(index);
    lightbox.showModal();
    document.body.classList.add("modal-open");
  }));
  $("#lightbox-prev").addEventListener("click", () => showPhoto(currentPhotoIndex - 1));
  $("#lightbox-next").addEventListener("click", () => showPhoto(currentPhotoIndex + 1));
  $("#lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("close", () => document.body.classList.remove("modal-open"));
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.close();
  });
  document.addEventListener("keydown", event => {
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") showPhoto(currentPhotoIndex - 1);
    if (event.key === "ArrowRight") showPhoto(currentPhotoIndex + 1);
  });

  // Expandable reasons to love her
  $$(".reason-card").forEach(card => {
    card.setAttribute("aria-expanded", "false");
    card.addEventListener("click", () => {
      const isOpen = card.classList.toggle("open");
      card.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) createHearts(3);
    });
  });

  // Love-note modal
  const noteModal = $("#note-modal");
  $$(".note-envelope").forEach(button => button.addEventListener("click", () => {
    $("#note-modal-title").textContent = button.dataset.title;
    $("#note-modal-message").textContent = button.dataset.message;
    noteModal.showModal();
    document.body.classList.add("modal-open");
    createHearts(5);
  }));
  function closeNoteModal() { noteModal.close(); }
  $("#note-close").addEventListener("click", closeNoteModal);
  $("#note-modal-done").addEventListener("click", closeNoteModal);
  noteModal.addEventListener("close", () => document.body.classList.remove("modal-open"));
  noteModal.addEventListener("click", event => {
    if (event.target === noteModal) closeNoteModal();
  });

  // Birthday candle interaction
  const flame = $("#cake-flame");
  let candleBlown = false;
  function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;
    flame.classList.add("blown");
    flame.textContent = "♡";
    flame.setAttribute("aria-label", "Candle blown out");
    $("#wish-result").textContent = "May life bring you all the happiness your heart deserves. Happy birthday, my love! 💗";
    createHearts(42);
    showToast("Wish made! Sending you all the love ✨");
  }
  flame.addEventListener("click", blowCandle);
  flame.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      blowCandle();
    }
  });

  // Final message
  $("#final-message-button").addEventListener("click", () => {
    const message = $("#final-message");
    message.classList.remove("hidden");
    $("#final-message-button").textContent = "Sending you the biggest hug ♡";
    $("#final-message-button").disabled = true;
    createHearts(35);
    message.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Back to top
  const backToTop = $("#back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Gentle floating hearts occasionally, only after opening.
  setInterval(() => {
    if (!main.classList.contains("hidden") && Math.random() > 0.45) createHearts(1);
  }, 4200);

  // First view may be animated in browsers without IntersectionObserver support.
  if (!("IntersectionObserver" in window)) initRevealObserver();
})();
