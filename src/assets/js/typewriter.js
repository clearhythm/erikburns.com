document.addEventListener('DOMContentLoaded', function() {
  const wordEl = document.querySelector('.cycle-word');
  if (!wordEl) return;

  const words = ['Work', 'Behavior', 'Systems'];
  let index = 0;

  // Entrance: span starts blurred in HTML, remove class to animate in
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      wordEl.classList.remove('cycle-blur');
    });
  });

  function next() {
    if (index >= words.length - 1) return;
    index++;

    wordEl.classList.add('cycle-blur');

    setTimeout(function() {
      wordEl.textContent = words[index];
      wordEl.offsetHeight; // force reflow
      wordEl.classList.remove('cycle-blur');
    }, 730);
  }

  // Start cycling after entrance transition completes
  setTimeout(function() {
    var interval = setInterval(function() {
      next();
      if (index >= words.length - 1) clearInterval(interval);
    }, 7000);
  }, 1500);

  // Signal orb label — cursor sweeps through old word replacing with new
  const labelEl = document.getElementById('signal-orb-label');
  if (labelEl) {
    const states = ['Listening...', 'Waiting...', 'Feeling...'];
    let labelIndex = 0;
    const CURSOR = '▌';

    function sweepTo(from, to, onDone) {
      var maxLen = Math.max(from.length, to.length);
      var i = 0;
      function step() {
        var display = to.slice(0, Math.min(i, to.length))
                    + (i < maxLen ? CURSOR : '')
                    + from.slice(i + 1);
        labelEl.textContent = display;
        i++;
        if (i <= maxLen) { setTimeout(step, 70); }
        else { labelEl.textContent = to; onDone && onDone(); }
      }
      step();
    }

    function nextWord() {
      var from = states[labelIndex];
      labelIndex = (labelIndex + 1) % states.length;
      sweepTo(from, states[labelIndex], function() {
        setTimeout(nextWord, 5500);
      });
    }

    function typeIn(target, onDone) {
      var i = 0;
      labelEl.textContent = CURSOR;
      function step() {
        i++;
        labelEl.textContent = target.slice(0, i) + (i < target.length ? CURSOR : '');
        if (i < target.length) { setTimeout(step, 70); }
        else { labelEl.textContent = target; onDone && onDone(); }
      }
      setTimeout(step, 70);
    }

    labelEl.textContent = '\u00a0';
    setTimeout(function() {
      typeIn(states[0], function() {
        setTimeout(nextWord, 5500);
      });
    }, 900);
  }

});
