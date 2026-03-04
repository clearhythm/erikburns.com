(function() {
  const steps = document.querySelectorAll('.arc-step[data-step]');
  const panels = document.querySelectorAll('.arc-success-panel[data-step]');

  if (!steps.length) return;

  steps.forEach(function(step) {
    step.addEventListener('click', function() {
      const target = this.dataset.step;

      steps.forEach(function(s) { s.classList.remove('active'); });
      panels.forEach(function(p) { p.classList.remove('active'); });

      this.classList.add('active');
      const panel = document.querySelector('.arc-success-panel[data-step="' + target + '"]');
      if (panel) panel.classList.add('active');
    });
  });
})();
