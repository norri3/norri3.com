"use client";

import { useCallback } from "react";

export function ConfettiButton() {
  const handleClick = useCallback(() => {
    const colors = ["#ff00aa", "#00ff88", "#00aaff", "#ffaa00"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    document.body.style.background = randomColor;

    // Reset background after animation
    setTimeout(() => {
      document.body.style.background = "";
    }, 3000);

    // Confetti effect
    const emojis = ["🎉", "🔥", "✨"];
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      confetti.style.position = "fixed";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-50px";
      confetti.style.fontSize = "2rem";
      confetti.style.zIndex = "9999";
      confetti.style.transition = "all 3s";
      confetti.style.pointerEvents = "none";
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`;
        confetti.style.opacity = "0";
      }, 10);

      setTimeout(() => confetti.remove(), 4000);
    }

    console.log("🎉 JavaScript just ran on norri3.com!");
  }, []);

  return (
    <button
      onClick={handleClick}
      className="px-10 py-4 text-xl bg-[var(--primary)] text-[var(--primary-foreground)] border-none rounded-full cursor-pointer font-bold transition-all hover:bg-[#00cc6e] hover:scale-105"
    >
      Click me!
    </button>
  );
}
