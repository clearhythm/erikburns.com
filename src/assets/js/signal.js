/**
 * Signal — bar animation + launch helper
 * Chat is handled by embed.js from signal.habitualos.com
 *
 * To go live: set SIGNAL_LIVE = true
 */

window.SIGNAL_LIVE = false;

window.signalLaunch = function () {
  if (window.SIGNAL_LIVE && window.Signal) {
    Signal.open();
  } else {
    var modal = document.getElementById('signal-coming-soon');
    if (modal) modal.style.display = 'flex';
  }
};

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
