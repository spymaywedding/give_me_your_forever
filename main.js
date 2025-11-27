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
});
