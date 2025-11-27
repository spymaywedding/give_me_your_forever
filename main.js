window.addEventListener("load", () => {
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
});
