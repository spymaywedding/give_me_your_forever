window.addEventListener("load", () => {
  // Opening invitation overlay
  const introOverlay = document.getElementById("intro-overlay");
  const introBtn = document.getElementById("intro-open");
  if (introOverlay && introBtn) {
    document.body.classList.add("intro-locked");
    introBtn.addEventListener("click", () => {
      introOverlay.classList.add("hidden");
      document.body.classList.remove("intro-locked");
    }, { once: true });
  }

  // Ambient gold petals drifting across the whole site
  const petalField = document.getElementById("petal-field");
  if (petalField) {
    const PETAL_COUNT = window.innerWidth < 640 ? 8 : 14;
    const colors = ["#caa25e", "#8a3b05", "#5c0010", "#d28b62"];
    const petalSvg = (color) =>
      `<svg width="100%" height="100%" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 0C13 3 18 6 9 18C0 6 5 3 9 0Z" fill="${color}"/></svg>`;
    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      const size = 10 + Math.random() * 12;
      const left = Math.random() * 100;
      const duration = 14 + Math.random() * 12;
      const delay = Math.random() * -duration;
      const drift = (Math.random() - 0.5) * 160;
      petal.style.left = `${left}vw`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.setProperty("--drift", `${drift}px`);
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      petal.innerHTML = petalSvg(colors[i % colors.length]);
      petalField.appendChild(petal);
    }
  }

  // Dress code swatches: tap a color for a near-fullscreen panel with its hex
  // code, big enough to hold the phone up next to fabric when shopping
  const swatches = document.querySelectorAll("#dress-swatches span");
  const colorPopup = document.getElementById("color-popup");
  const colorPopupChip = document.getElementById("color-popup-chip");
  const colorPopupText = document.getElementById("color-popup-text");
  const colorPopupClose = document.getElementById("color-popup-close");
  if (swatches.length && colorPopup && colorPopupChip && colorPopupText) {
    const swatchList = Array.from(swatches);
    let activeIndex = 0;

    const closePopup = () => colorPopup.classList.remove("visible");

    const showColor = (index) => {
      activeIndex = (index + swatchList.length) % swatchList.length;
      const sw = swatchList[activeIndex];
      swatchList.forEach((s) => s.classList.remove("active"));
      sw.classList.add("active");
      colorPopupChip.style.background = sw.dataset.hex;
      colorPopupText.textContent = `${sw.dataset.name} · ${sw.dataset.hex}`;
    };

    swatchList.forEach((sw, i) => {
      sw.addEventListener("click", () => {
        showColor(i);
        colorPopup.classList.add("visible");
      });
    });

    if (colorPopupClose) colorPopupClose.addEventListener("click", closePopup);
    colorPopup.addEventListener("click", (e) => {
      if (e.target === colorPopup) closePopup();
    });

    // Swipe (or drag) left/right on the open panel to browse other colors
    let dragStartX = null;
    const onSwipeEnd = (endX) => {
      if (dragStartX === null) return;
      const delta = endX - dragStartX;
      const SWIPE_THRESHOLD = 40;
      if (delta > SWIPE_THRESHOLD) showColor(activeIndex - 1);
      else if (delta < -SWIPE_THRESHOLD) showColor(activeIndex + 1);
      dragStartX = null;
    };
    colorPopup.addEventListener("touchstart", (e) => {
      dragStartX = e.touches[0].clientX;
    }, { passive: true });
    colorPopup.addEventListener("touchend", (e) => onSwipeEnd(e.changedTouches[0].clientX));
    colorPopup.addEventListener("mousedown", (e) => {
      dragStartX = e.clientX;
    });
    colorPopup.addEventListener("mouseup", (e) => onSwipeEnd(e.clientX));
  }

  // Back-to-top button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 480);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll-reveal: sections rise into view as the guest scrolls
  const revealTargets = document.querySelectorAll("section, .footer");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  }

  const audio = document.getElementById("bgm");
  if (!audio) return;

  // ฟังก์ชันเริ่มเล่น + fade-in
  const startPlay = () => {
    audio.volume = 0;
    audio.muted = false;
    audio.play().catch(() => {
      // ถ้าโดนบล็อกจาก autoplay จะรอ gesture แทน
    });

    // Fade-in เสียง 1.5 วินาที
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol += 0.02;               // เพิ่มทีละน้อย
      if (vol >= 1) {
        vol = 1;
        clearInterval(fadeIn);   // จบ fade-in
      }
      audio.volume = vol;
    }, 30);
  };

  // Autoplay attempt on load
  startPlay();

  // ถ้า autoplay โดนบล็อก ให้กด/แตะครั้งแรกเพื่อเริ่ม
  const resumeOnGesture = () => {
    audio.play().then(() => {
      audio.muted = false;
      if (audio.volume === 0) {
        startPlay();
      }
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("touchstart", resumeOnGesture);
    }).catch(() => {});
  };

  window.addEventListener("pointerdown", resumeOnGesture, { once: true });
  window.addEventListener("touchstart", resumeOnGesture, { once: true });

  // Countdown to 21 Nov 2026 (00:00 local time)
  const countdown = document.getElementById("hero-countdown");
  if (countdown) {
    const target = new Date("2026-11-21T00:00:00");
    const setValue = (unit, value) => {
      const el = countdown.querySelector(`[data-unit="${unit}"]`);
      if (el) el.textContent = value.toString().padStart(2, "0");
    };
    const tick = () => {
      const now = new Date();
      let diff = target - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setValue("days", days);
      setValue("hours", hours);
      setValue("minutes", minutes);
      setValue("seconds", seconds);
    };
    tick();
    setInterval(tick, 1000);
  }

  // Moments gallery: auto-playing Ken Burns slideshow, swipeable to browse manually
  // Slides are built from moments/manifest.json: entries with an "order" are
  // pinned to that slide position, entries without one are shuffled randomly
  // into the remaining slots on every page load.
  const arrangeMomentsEntries = (entries) => {
    const total = entries.length;
    const result = new Array(total).fill(null);
    const loose = [];

    entries.forEach((entry) => {
      const pos = entry.order;
      if (Number.isInteger(pos) && pos >= 1 && pos <= total && !result[pos - 1]) {
        result[pos - 1] = entry;
      } else {
        loose.push(entry);
      }
    });

    // Fisher-Yates shuffle for the unpinned photos
    for (let i = loose.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [loose[i], loose[j]] = [loose[j], loose[i]];
    }

    let looseIndex = 0;
    return result.map((entry) => entry || loose[looseIndex++]);
  };

  const slider = document.getElementById("moments-slider");
  if (slider) {
    fetch("./moments/manifest.json")
      .then((res) => res.json())
      .then((entries) => initMomentsSlider(arrangeMomentsEntries(entries)))
      .catch(() => initMomentsSlider([]));
  }

  function initMomentsSlider(entries) {
    const slider = document.getElementById("moments-slider");
    const dotsWrap = slider.querySelector(".moments-dots");
    if (!entries.length) return;

    entries.forEach((entry, i) => {
      const slide = document.createElement("div");
      slide.className = "moments-slide";
      const img = document.createElement("img");
      if (entry.position) img.style.objectPosition = entry.position;
      img.src = `./moments/${entry.file}`;
      img.alt = `Moment ${i + 1}`;
      slide.appendChild(img);
      slider.insertBefore(slide, dotsWrap);
    });

    const slides = Array.from(slider.querySelectorAll(".moments-slide"));
    const dots = slides.map((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsWrap.appendChild(dot);
      return dot;
    });

    const AUTOPLAY_MS = 6000;
    const RESUME_DELAY_MS = 5000;
    let current = 0;
    let autoplayTimer = null;
    let resumeTimer = null;

    const render = () => {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      render();
    };

    const startAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    };

    const stopAutoplay = () => clearInterval(autoplayTimer);

    const scheduleResume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAutoplay, RESUME_DELAY_MS);
    };

    render();
    startAutoplay();

    // Swipe / drag navigation
    let dragging = false;
    let startX = 0;

    const onDragStart = (x) => {
      dragging = true;
      startX = x;
      stopAutoplay();
    };

    const onDragEnd = (x) => {
      if (!dragging) return;
      dragging = false;
      const delta = x - startX;
      const SWIPE_THRESHOLD = 40;
      if (delta > SWIPE_THRESHOLD) goTo(current - 1);
      else if (delta < -SWIPE_THRESHOLD) goTo(current + 1);
      scheduleResume();
    };

    slider.addEventListener("touchstart", (e) => onDragStart(e.touches[0].clientX), { passive: true });
    slider.addEventListener("touchend", (e) => onDragEnd(e.changedTouches[0].clientX));

    slider.addEventListener("mousedown", (e) => {
      e.preventDefault();
      onDragStart(e.clientX);
    });
    window.addEventListener("mouseup", (e) => onDragEnd(e.clientX));

    dots.forEach((dot, i) => {
      dot.style.cursor = "pointer";
      dot.addEventListener("click", () => {
        stopAutoplay();
        goTo(i);
        scheduleResume();
      });
    });
  }

  // Drifting gold sparkles behind key sections (D3) — hero, RSVP, location, gift, social
  const initGoldParticles = (host) => {
    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;
    if (!width || !height) return;

    const svg = d3.select(host)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid slice");

    const PARTICLE_COUNT = window.innerWidth < 640 ? 20 : 36;
    const particles = d3.range(PARTICLE_COUNT).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.8,
      speed: Math.random() * 0.35 + 0.12,
      drift: (Math.random() - 0.5) * 0.25
    }));

    const dots = svg.selectAll("circle")
      .data(particles)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", "#ffd98a")
      .attr("opacity", 0.6);

    const twinkle = (sel) => {
      sel.transition()
        .delay(() => Math.random() * 4000)
        .duration(() => 1500 + Math.random() * 1800)
        .attr("opacity", () => 0.15 + Math.random() * 0.6)
        .on("end", function () { twinkle(d3.select(this)); });
    };
    twinkle(dots);

    d3.timer(() => {
      dots
        .attr("cy", (d) => {
          d.y -= d.speed;
          if (d.y < -8) d.y = height + 8;
          return d.y;
        })
        .attr("cx", (d) => {
          d.x += d.drift;
          if (d.x < -8) d.x = width + 8;
          if (d.x > width + 8) d.x = -8;
          return d.x;
        });
    });
  };

  if (typeof d3 !== "undefined") {
    document.querySelectorAll(".gold-particles").forEach(initGoldParticles);
  }

  // Cursor gold sparkle trail (fine-pointer / desktop only)
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    let lastSpark = 0;
    window.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastSpark < 60) return;
      lastSpark = now;
      const spark = document.createElement("div");
      spark.className = "cursor-spark";
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    });
  }

  // Hashtag icon: Facebook ignores pre-filled post text from external links
  // (anti-spam), so copy the hashtag to the clipboard and let the guest
  // paste it once Facebook's composer opens.
  const shareFbBtn = document.getElementById("share-fb-btn");
  const copyToast = document.getElementById("copy-toast");
  if (shareFbBtn) {
    shareFbBtn.addEventListener("click", async () => {
      const hashtag = "#mayandspywedding";
      try {
        await navigator.clipboard.writeText(hashtag);
        if (copyToast) {
          copyToast.textContent = "คัดลอก #mayandspywedding แล้ว — วางตอนโพสต์ได้เลย";
          copyToast.classList.add("visible");
          setTimeout(() => copyToast.classList.remove("visible"), 3000);
        }
      } catch (err) {
        window.prompt("คัดลอกแฮชแท็กนี้แล้ววางตอนโพสต์:", hashtag);
      }
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(hashtag)}`;
      window.open(url, "_blank", "noopener,width=600,height=600");
    });
  }
});
