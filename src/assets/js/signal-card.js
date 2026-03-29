(function () {
  const orbCard = document.querySelector('.signal-orb-col');
  if (!orbCard) return;

  orbCard.addEventListener('mouseenter', () => {
    const fills = orbCard.querySelectorAll('.signal-sample-fill');
    fills.forEach(fill => {
      fill.style.transition = 'none';
      fill.style.width = '0';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fills.forEach((fill, i) => {
        fill.style.transition = '';
        fill.style.transitionDelay = [0.05, 0.2, 0.35][i] + 's';
        fill.style.width = fill.dataset.width + '%';
      });
    }));
  });
})();
