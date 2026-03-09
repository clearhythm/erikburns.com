// Lotus circuit spark animation — synced to word cycling
// Each cycle picks one random branch + one random color
(function () {
  'use strict';

  var wrap = document.querySelector('.hero-mark-wrap');
  if (!wrap) return;
  var img = wrap.querySelector('.hero-mark');
  if (!img) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'lotus-sparks-canvas';
  wrap.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function resize() {
    if (!img.offsetWidth) return;
    canvas.width  = img.offsetWidth;
    canvas.height = img.offsetHeight;
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(img);
  } else {
    img.addEventListener('load', resize);
    window.addEventListener('resize', resize);
  }
  if (img.complete && img.naturalWidth) resize();

  // ── Routes: arrays of [x, y] normalized waypoints
  // Each starts at origin (50%, 64%) and follows one branch to its endpoint
  var PATHS = [
    // Center stem → bottom terminal
    [[0.50, 0.64], [0.50, 0.91]],
    // Left bus → far left stub
    [[0.50, 0.64], [0.50, 0.68], [0.08, 0.68], [0.08, 0.61]],
    // Left bus → stub 2
    [[0.50, 0.64], [0.50, 0.68], [0.18, 0.68], [0.18, 0.61]],
    // Left bus → stub 3
    [[0.50, 0.64], [0.50, 0.68], [0.29, 0.68], [0.29, 0.61]],
    // Left bus → inner stub
    [[0.50, 0.64], [0.50, 0.68], [0.39, 0.68], [0.39, 0.63]],
    // Left bus → left loop (down)
    [[0.50, 0.64], [0.50, 0.68], [0.30, 0.68], [0.30, 0.85]],
    // Right bus → far right stub
    [[0.50, 0.64], [0.50, 0.68], [0.92, 0.68], [0.92, 0.61]],
    // Right bus → stub 2
    [[0.50, 0.64], [0.50, 0.68], [0.82, 0.68], [0.82, 0.61]],
    // Right bus → stub 3
    [[0.50, 0.64], [0.50, 0.68], [0.71, 0.68], [0.71, 0.61]],
    // Right bus → inner stub
    [[0.50, 0.64], [0.50, 0.68], [0.61, 0.68], [0.61, 0.63]],
    // Right bus → right loop (down)
    [[0.50, 0.64], [0.50, 0.68], [0.70, 0.68], [0.70, 0.85]],
  ];

  // Colors [r, g, b] — emerald green palette matching Signal score bars
  var COLORS = [
    [5, 150, 105],    // rich dark emerald
    [16, 185, 129],   // mid emerald
    [52, 211, 153],   // lighter emerald
    [6, 120, 85],     // deep emerald
    [110, 231, 183],  // soft mint
  ];

  // ── Build per-segment lengths for a path
  function buildSegs(path, W, H) {
    var segs = [], totalLen = 0;
    for (var i = 0; i < path.length - 1; i++) {
      var p1 = path[i], p2 = path[i + 1];
      var d  = Math.hypot((p2[0] - p1[0]) * W, (p2[1] - p1[1]) * H);
      totalLen += d;
      segs.push({ x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], len: d });
    }
    return { segs: segs, totalLen: totalLen };
  }

  // ── Position at progress t (0-1) along a multi-segment path
  function posAtT(built, t, W, H) {
    var target = t * built.totalLen;
    var accum  = 0;
    for (var i = 0; i < built.segs.length; i++) {
      var s = built.segs[i];
      if (accum + s.len >= target || i === built.segs.length - 1) {
        var lt = s.len > 0 ? Math.min(1, (target - accum) / s.len) : 1;
        return {
          x: (s.x1 + (s.x2 - s.x1) * lt) * W,
          y: (s.y1 + (s.y2 - s.y1) * lt) * H,
        };
      }
      accum += s.len;
    }
    var last = built.segs[built.segs.length - 1];
    return { x: last.x2 * W, y: last.y2 * H };
  }

  // ── State
  var spark = null;
  var rafId = null;
  var PX_PER_MS = 0.18; // travel speed

  function fireSparks() {
    if (!canvas.width) return;
    var W = canvas.width, H = canvas.height;
    var path  = PATHS[Math.floor(Math.random() * PATHS.length)];
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var built = buildSegs(path, W, H);

    spark = {
      built:     built,
      color:     color,
      duration:  Math.max(380, built.totalLen / PX_PER_MS),
      startedAt: performance.now(),
      done:      false,
    };

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick(now) {
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!spark || spark.done) { rafId = null; return; }

    var t = Math.min(1, (now - spark.startedAt) / spark.duration);
    if (t >= 1) {
      spark.done = true;
      rafId = null;
      ctx.clearRect(0, 0, W, H);
      return;
    }

    var alpha   = t < 0.80 ? 1.0 : (1 - t) / 0.20;
    var c       = spark.color;
    var rgb     = c[0] + ',' + c[1] + ',' + c[2];
    var head    = posAtT(spark.built, t, W, H);
    var tailT   = Math.max(0, t - 0.25);
    var tail    = posAtT(spark.built, tailT, W, H);

    // Trail
    if (Math.abs(head.x - tail.x) > 0.5 || Math.abs(head.y - tail.y) > 0.5) {
      var trail = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      trail.addColorStop(0, 'rgba(' + rgb + ',0)');
      trail.addColorStop(1, 'rgba(' + rgb + ',' + (0.5 * alpha) + ')');
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.strokeStyle = trail;
      ctx.lineWidth   = 1.0;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    // Head glow
    var glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 4.5);
    glow.addColorStop(0,   'rgba(' + rgb + ',' + (0.95 * alpha) + ')');
    glow.addColorStop(0.5, 'rgba(' + rgb + ',' + (0.45 * alpha) + ')');
    glow.addColorStop(1,   'rgba(' + rgb + ',0)');
    ctx.beginPath();
    ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    rafId = requestAnimationFrame(tick);
  }

  // ── Trigger on word cycle
  var wordEl = document.querySelector('.cycle-word');
  if (wordEl) {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'class') {
          if (wordEl.classList.contains('cycle-blur')) fireSparks();
        }
      }
    }).observe(wordEl, { attributes: true });
  }

  // ── Initial fire on page load
  function tryInitialFire() {
    if (canvas.width > 0) {
      setTimeout(fireSparks, 1100);
    } else {
      img.addEventListener('load', function () { resize(); setTimeout(fireSparks, 1100); });
    }
  }
  tryInitialFire();

}());
