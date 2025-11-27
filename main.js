window.addEventListener("load", () => {
  const audio = document.getElementById("bgm");

  // เริ่มด้วย volume 0 และ muted = true (เปิดเว็บจะเล่นทันที)
  audio.volume = 0;
  audio.muted = false;  // เปิดเสียงหลังโหลด
  audio.play().catch(err => console.log(err));

  // Fade-in เสียง 1.5 วินาที
  let vol = 0;
  const fadeIn = setInterval(() => {
    vol += 0.02;               // เพิ่มทีละน้อย
    if (vol >= 1) {
      vol = 1;
      clearInterval(fadeIn);   // จบ fade-in
    }
    audio.volume = vol;
  }, 30);  // 30ms × 50 step ≈ 1.5 sec
});