document.addEventListener('DOMContentLoaded', function() {
  const wordEl = document.querySelector('.cycle-word');
  if (!wordEl) return;

  const words = ['Science', 'Behavior', 'Systems'];
  let index = 0;

  // Entrance: span starts blurred in HTML, remove class to animate in
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      wordEl.classList.remove('cycle-blur');
    });
  });

  function next() {
    index = (index + 1) % words.length;

    wordEl.classList.add('cycle-blur');

    setTimeout(function() {
      wordEl.textContent = words[index];
      wordEl.offsetHeight; // force reflow
      wordEl.classList.remove('cycle-blur');
    }, 730);
  }

  // Start cycling after entrance transition completes
  setTimeout(function() {
    setInterval(next, 7000);
  }, 1500);
});
