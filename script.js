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
          typeElement(entry.target, Number(entry.target.dataset.delay || 180));
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

  const verticalTextItems = [...document.querySelectorAll("[data-vertical-text]")];

  function prepareVerticalText(element, columnIndex) {
    const completeText = element.textContent.trim();
    element.setAttribute("aria-label", completeText);

    if (reducedMotion.matches) {
      element.classList.add("is-flowing");
      return;
    }

    const speed = Number(element.dataset.speed || 180);
    let elapsed = columnIndex * 450;
    element.textContent = "";

    for (const character of completeText) {
      const characterElement = document.createElement("i");
      characterElement.textContent = character;
      characterElement.setAttribute("aria-hidden", "true");
      characterElement.style.setProperty("--character-delay", `${elapsed}ms`);
      element.appendChild(characterElement);
      elapsed += speed + (/[，。；：！？、·]/.test(character) ? 320 : 0);
    }
  }

  verticalTextItems.forEach(prepareVerticalText);

  if (verticalTextItems.length && !reducedMotion.matches && "IntersectionObserver" in window) {
    const verticalObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll("[data-vertical-text]").forEach((item) => item.classList.add("is-flowing"));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.34 },
    );
    document.querySelectorAll(".vertical-showcase").forEach((showcase) => verticalObserver.observe(showcase));
  } else {
    verticalTextItems.forEach((item) => item.classList.add("is-flowing"));
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
  const closingSection = document.getElementById("closing");
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

    const visibleNightSections = new Set();
    const qixiViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleNightSections.add(entry.target);
          else visibleNightSections.delete(entry.target);
        });
        body.classList.toggle("night-section-in-view", visibleNightSections.size > 0);
      },
      { threshold: 0.12 },
    );
    qixiViewObserver.observe(qixiSection);
    if (closingSection) qixiViewObserver.observe(closingSection);
  } else {
    loadQixiFrame();
  }

  const uptimeFields = {
    days: document.querySelector('[data-uptime="days"]'),
    hours: document.querySelector('[data-uptime="hours"]'),
    minutes: document.querySelector('[data-uptime="minutes"]'),
    seconds: document.querySelector('[data-uptime="seconds"]'),
  };
  const siteCreatedAt = new Date("2026-08-22T17:20:29+08:00").getTime();

  function updateUptime() {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - siteCreatedAt) / 1000));
    const days = Math.floor(elapsedSeconds / 86400);
    const hours = Math.floor((elapsedSeconds % 86400) / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    if (uptimeFields.days) uptimeFields.days.textContent = String(days).padStart(3, "0");
    if (uptimeFields.hours) uptimeFields.hours.textContent = String(hours).padStart(2, "0");
    if (uptimeFields.minutes) uptimeFields.minutes.textContent = String(minutes).padStart(2, "0");
    if (uptimeFields.seconds) uptimeFields.seconds.textContent = String(seconds).padStart(2, "0");
  }

  updateUptime();
  window.setInterval(updateUptime, 1000);

  const totalVisitors = document.getElementById("totalVisitors");
  const todayPageviews = document.getElementById("todayPageviews");
  const statsStatus = document.getElementById("statsStatus");

  function getChinaDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const part = (type) => parts.find((item) => item.type === type)?.value || "00";
    return `${part("year")}-${part("month")}-${part("day")}`;
  }

  async function readVisitCounter(action, key, options = {}) {
    const endpoint = new URL(`https://counterapi.com/api/lixinyan-resume-2/${action}/${key}`);
    Object.entries(options).forEach(([name, value]) => endpoint.searchParams.set(name, String(value)));

    if (window.location.hostname !== "lixinyan1025-commits.github.io") {
      endpoint.searchParams.set("readOnly", "true");
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(endpoint, { signal: controller.signal, mode: "cors" });
      if (!response.ok) throw new Error(`Counter service returned ${response.status}`);
      const result = await response.json();
      if (!Number.isFinite(Number(result.value))) throw new Error("Counter response is invalid");
      return Number(result.value);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function loadVisitStats() {
    if (!totalVisitors || !todayPageviews || !statsStatus) return;

    const results = await Promise.allSettled([
      readVisitCounter("visitor", "home", { unique: true }),
      readVisitCounter("view", getChinaDateKey()),
    ]);
    const [visitorResult, todayResult] = results;

    if (visitorResult.status === "fulfilled") totalVisitors.textContent = visitorResult.value.toLocaleString("zh-CN");
    else totalVisitors.textContent = "暂不可用";

    if (todayResult.status === "fulfilled") todayPageviews.textContent = todayResult.value.toLocaleString("zh-CN");
    else todayPageviews.textContent = "暂不可用";

    const hasError = results.some((result) => result.status === "rejected");
    statsStatus.textContent = hasError
      ? "部分访问数据暂时无法连接，本站运行时间仍会正常记录。"
      : "匿名计数 · 不收集姓名、电话或邮箱等个人信息";
    statsStatus.classList.toggle("is-error", hasError);
  }

  loadVisitStats();

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
    if (!leafField || reducedMotion.matches || document.hidden || body.classList.contains("night-section-in-view")) return;
    const isMobile = window.innerWidth < 720;
    const maximum = isMobile ? 11 : 20;
    if (liveLeaves >= maximum) return;

    const leaf = document.createElement("i");
    const isGolden = Math.random() < 0.3;
    leaf.className = `floating-leaf ${isGolden ? "floating-leaf-gold" : "floating-leaf-bamboo"}`;
    const size = 10 + Math.random() * 15;
    const duration = 9 + Math.random() * 7;
    const drift = -100 + Math.random() * 200;
    const usesGutter = Math.random() < 0.7;
    const startsLeft = Math.random() < 0.5;
    const x = usesGutter
      ? (startsLeft ? Math.random() * 18 : 82 + Math.random() * 18)
      : 18 + Math.random() * 64;

    leaf.style.setProperty("--leaf-x", `${x}vw`);
    leaf.style.setProperty("--leaf-size", `${size}px`);
    leaf.style.setProperty("--leaf-duration", `${duration}s`);
    leaf.style.setProperty("--leaf-delay", initial ? `${-(Math.random() * duration)}s` : "0s");
    leaf.style.setProperty("--leaf-drift", `${drift}px`);
    leaf.style.setProperty("--leaf-return", `${drift * -0.45}px`);
    leaf.style.setProperty("--leaf-opacity", `${0.5 + Math.random() * 0.3}`);

    leafField.appendChild(leaf);
    liveLeaves += 1;
    leaf.addEventListener("animationend", () => {
      leaf.remove();
      liveLeaves -= 1;
    }, { once: true });
  }

  if (!reducedMotion.matches) {
    const initialCount = window.innerWidth < 720 ? 8 : 14;
    for (let index = 0; index < initialCount; index += 1) spawnLeaf(true);

    function scheduleLeaf() {
      const isMobile = window.innerWidth < 720;
      const delay = isMobile ? 1000 + Math.random() * 500 : 550 + Math.random() * 350;
      window.setTimeout(() => {
        spawnLeaf(false);
        scheduleLeaf();
      }, delay);
    }

    scheduleLeaf();
  }
})();
