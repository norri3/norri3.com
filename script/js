// Pure JavaScript - no frameworks needed
const button = document.getElementById('clickMe');

button.addEventListener('click', () => {
  const colors = ['#ff00aa', '#00ff88', '#00aaff', '#ffaa00'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  document.body.style.background = randomColor;
  
  // Confetti effect with pure JS
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = ['🎉', '🔥', '✨'][Math.floor(Math.random() * 3)];
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-50px';
    confetti.style.fontSize = '2rem';
    confetti.style.zIndex = '9999';
    confetti.style.transition = 'all 3s';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0';
    }, 10);
    
    setTimeout(() => confetti.remove(), 4000);
  }
  
  console.log('🎉 JavaScript just ran on norri3.com!');
});
