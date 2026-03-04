document.addEventListener('DOMContentLoaded', function() {
  const wordEl = document.querySelector('.cycle-word');
  if (!wordEl) return;

  const words = ['Science', 'Behavior', 'Systems'];
  let index = 0;

  const proofContainer = document.querySelector('.hero-proof');
  const frame = document.querySelector('.hero-proof-frame');

  function setActiveProof(word) {
    document.querySelectorAll('.hero-proof [data-word]').forEach(el => {
      el.classList.toggle('active', el.dataset.word === word);
    });
    if (frame && proofContainer) {
      const activeEl = proofContainer.querySelector('[data-word="' + word + '"]');
      if (activeEl) {
        const containerRect = proofContainer.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        frame.style.width = elRect.width + 'px';
        frame.style.transform = 'translateX(' + (elRect.left - containerRect.left) + 'px)';
      }
    }
  }

  // Entrance: span starts blurred in HTML, remove class to animate in
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      wordEl.classList.remove('cycle-blur');
      setActiveProof(words[index]);
    });
  });

  function next() {
    index = (index + 1) % words.length;

    wordEl.classList.add('cycle-blur');

    setTimeout(function() {
      wordEl.textContent = words[index];
      wordEl.offsetHeight; // force reflow
      wordEl.classList.remove('cycle-blur');
      setActiveProof(words[index]);
    }, 730);
  }

  // Start cycling after entrance transition completes
  setTimeout(function() {
    setInterval(next, 7000);
  }, 1500);
});
