(function() {
  const container = document.querySelector('.hero-bars');
  if (!container) return;

  const barW = 50, gap = 0;
  const colors = [
    '#5b21b6','#6d28d9','#7c3aed','#8b5cf6','#a78bfa',
    '#6366f1','#4f46e5','#2563eb','#1d4ed8','#0369a1',
    '#0891b2','#0d9488'
  ];

  const count = Math.ceil(window.innerWidth / barW) + 2;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    const div = document.createElement('div');
    div.className = 'hero-bar';
    div.style.background = `linear-gradient(to top, ${color} 0%, ${color} 20%, transparent 65%)`;
    div.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    fragment.appendChild(div);
  }

  container.appendChild(fragment);
})();
