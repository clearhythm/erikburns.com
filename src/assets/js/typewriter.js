document.addEventListener('DOMContentLoaded', function() {
  const el = document.querySelector('.cycle-word');
  if (!el) return;

  const words = ['Wellness', 'Growth', 'Productivity'];
  let index = 0;

  function next() {
    index = (index + 1) % words.length;

    el.classList.add('cycle-blur');

    setTimeout(function() {
      el.textContent = words[index];
      el.offsetHeight; // force reflow before removing class
      el.classList.remove('cycle-blur');
    }, 730);
  }

  setInterval(next, 7000);
});
