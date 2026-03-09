(function() {
  const container = document.querySelector('.hero-bars');
  if (!container) return;

  const barW = 50;
  const colors = [
    'rgba(5,150,105,1.0)',
    'rgba(5,150,105,0.75)',
    'rgba(5,150,105,0.5)',
    'rgba(5,150,105,0.35)',
    'rgba(5,150,105,0.6)',
    'rgba(5,150,105,0.9)',
    'rgba(5,150,105,0.45)',
    'rgba(5,150,105,0.7)',
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
