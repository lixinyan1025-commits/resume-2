(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const body = document.body;

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  function updateHeader() {
    body.classList.toggle("has-scrolled", window.scrollY > Math.min(window.innerHeight * 0.62, 520));
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  async function typeElement(element, startDelay = 0) {
    if (!element || element.dataset.typed === "true") return;

    const completeText = element.textContent.trim();
    element.dataset.typed = "true";

    if (reducedMotion.matches) {
      element.classList.add("typed");
      return;
    }

    const speed = Number(element.dataset.speed || 72);
    element.setAttribute("aria-label", completeText);
    element.textContent = "";
    element.classList.add("typing");
    await wait(startDelay);

    for (const character of completeText) {
      element.textContent += character;
      const punctuationPause = /[，。；：！？、]/.test(character) ? 220 : 0;
      await wait(speed + punctuationPause);
    }

    element.classList.remove("typing");
    element.classList.add("typed");
  }

  const heroType = document.querySelector(".hero-meta[data-typewriter]");
  typeElement(heroType, 620);

  const scrollTypeItems = [...document.querySelectorAll("[data-typewriter]")].filter((item) => item !== heroType);
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    scrollTypeItems.forEach((item) => typeElement(item));
  } else {
    const typeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          typeElement(entry.target, 180);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.42, rootMargin: "0px 0px -10%" },
    );
    scrollTypeItems.forEach((item) => typeObserver.observe(item));
  }

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    if (reducedMotion.matches) {
      heroVideo.pause();
    } else {
      const startHeroVideo = () => heroVideo.play().catch(() => {});
      if (heroVideo.readyState >= 2) startHeroVideo();
      else heroVideo.addEventListener("canplay", startHeroVideo, { once: true });

      heroVideo.addEventListener("timeupdate", () => {
        if (!Number.isFinite(heroVideo.duration)) return;
        if (heroVideo.duration - heroVideo.currentTime < 0.32) heroVideo.classList.add("is-fading");
      });

      heroVideo.addEventListener("ended", async () => {
        heroVideo.currentTime = 0;
        await heroVideo.play().catch(() => {});
        window.setTimeout(() => heroVideo.classList.remove("is-fading"), 80);
      });
    }
  }

  const music = document.getElementById("backgroundMusic");
  const musicControl = document.getElementById("musicControl");
  const musicLabel = document.getElementById("musicLabel");

  function updateMusicControl(isPlaying) {
    musicControl.setAttribute("aria-pressed", String(isPlaying));
    musicControl.setAttribute("aria-label", isPlaying ? "暂停背景音乐" : "播放背景音乐");
    musicLabel.textContent = isPlaying ? "暂停音乐" : "播放音乐";
    musicControl.classList.toggle("is-playing", isPlaying);
  }

  async function playMusic(autoplayAttempt = false) {
    try {
      music.volume = 0.34;
      await music.play();
      updateMusicControl(true);
      musicControl.classList.remove("needs-action");
      return true;
    } catch {
      updateMusicControl(false);
      if (autoplayAttempt) musicControl.classList.add("needs-action");
      return false;
    }
  }

  if (music && musicControl) {
    window.addEventListener("load", () => playMusic(true), { once: true });

    musicControl.addEventListener("click", async () => {
      musicControl.classList.remove("needs-action");
      if (music.paused) await playMusic(false);
      else {
        music.pause();
        updateMusicControl(false);
      }
    });

    music.addEventListener("play", () => updateMusicControl(true));
    music.addEventListener("pause", () => updateMusicControl(false));

    document.addEventListener("visibilitychange", () => {
      if (music.paused) return;
      music.volume = document.hidden ? 0.12 : 0.34;
    });
  }

  const details = document.getElementById("aboutDetails");
  if (details) {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      window.setTimeout(() => {
        const firstParagraph = details.querySelector("p");
        if (firstParagraph) firstParagraph.focus?.({ preventScroll: true });
      }, 0);
    });
  }

  const certificateDialog = document.getElementById("certificateDialog");
  const dialogImage = document.getElementById("dialogImage");
  const dialogTitle = document.getElementById("certificateDialogTitle");
  const dialogClose = document.getElementById("dialogClose");

  function closeCertificate() {
    if (!certificateDialog.open) return;
    certificateDialog.close();
  }

  document.querySelectorAll("[data-certificate]").forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title || "证书原图";
      dialogTitle.textContent = title;
      dialogImage.src = button.dataset.full;
      dialogImage.alt = `${title}证书原图`;
      certificateDialog.showModal();
      body.classList.add("dialog-open");
    });
  });

  if (certificateDialog) {
    dialogClose.addEventListener("click", closeCertificate);
    certificateDialog.addEventListener("click", (event) => {
      if (event.target === certificateDialog) closeCertificate();
    });
    certificateDialog.addEventListener("close", () => {
      body.classList.remove("dialog-open");
      window.setTimeout(() => {
        dialogImage.removeAttribute("src");
        dialogImage.alt = "";
      }, 80);
    });
  }

  const qixiSection = document.getElementById("qixi");
  const qixiFrame = document.getElementById("qixiFrame");
  const qixiIframe = document.getElementById("qixiIframe");

  function loadQixiFrame() {
    if (!qixiIframe || qixiIframe.src) return;
    qixiIframe.src = qixiIframe.dataset.src;
    qixiIframe.addEventListener("load", () => qixiFrame.classList.add("is-loaded"), { once: true });
    window.setTimeout(() => qixiFrame.classList.add("is-loaded"), 1800);
  }

  if (qixiSection && "IntersectionObserver" in window) {
    const qixiLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadQixiFrame();
        observer.disconnect();
      },
      { rootMargin: "700px 0px" },
    );
    qixiLoadObserver.observe(qixiSection);

    const qixiViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => body.classList.toggle("qixi-in-view", entry.isIntersecting));
      },
      { threshold: 0.12 },
    );
    qixiViewObserver.observe(qixiSection);
  } else {
    loadQixiFrame();
  }

  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { threshold: 0.18, rootMargin: "-30% 0px -55%" },
    );
    navSections.forEach((section) => navObserver.observe(section));
  }

  const leafField = document.querySelector(".leaf-field");
  let liveLeaves = 0;

  function spawnLeaf(initial = false) {
    if (!leafField || reducedMotion.matches || document.hidden || body.classList.contains("qixi-in-view")) return;
    const maximum = window.innerWidth < 720 ? 6 : 10;
    if (liveLeaves >= maximum) return;

    const leaf = document.createElement("i");
    leaf.className = "floating-leaf";
    const size = 9 + Math.random() * 10;
    const duration = 14 + Math.random() * 8;
    const drift = -70 + Math.random() * 140;
    const colors = ["rgba(151, 172, 91, .78)", "rgba(191, 151, 78, .7)", "rgba(103, 145, 116, .7)"];

    leaf.style.setProperty("--leaf-x", `${Math.random() * 100}vw`);
    leaf.style.setProperty("--leaf-size", `${size}px`);
    leaf.style.setProperty("--leaf-duration", `${duration}s`);
    leaf.style.setProperty("--leaf-delay", initial ? `${-(Math.random() * duration)}s` : "0s");
    leaf.style.setProperty("--leaf-drift", `${drift}px`);
    leaf.style.setProperty("--leaf-return", `${drift * -0.45}px`);
    leaf.style.setProperty("--leaf-opacity", `${0.28 + Math.random() * 0.28}`);
    leaf.style.setProperty("--leaf-color", colors[Math.floor(Math.random() * colors.length)]);

    leafField.appendChild(leaf);
    liveLeaves += 1;
    leaf.addEventListener("animationend", () => {
      leaf.remove();
      liveLeaves -= 1;
    }, { once: true });
  }

  if (!reducedMotion.matches) {
    const initialCount = window.innerWidth < 720 ? 4 : 7;
    for (let index = 0; index < initialCount; index += 1) spawnLeaf(true);
    window.setInterval(() => spawnLeaf(false), window.innerWidth < 720 ? 4200 : 2500);
  }
})();
