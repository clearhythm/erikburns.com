/**
 * Signal — interactive networking widget
 * Split-column layout: left = persona + input, right = conversation
 */

(function () {
  const API_URL = '/.netlify/functions/signal-chat';

  let persona = null;
  let chatHistory = [];

  // ─── Bar hover re-animation ───────────────────────────────────────────────

  const orbCard = document.querySelector('.signal-orb-col');
  if (orbCard) {
    orbCard.addEventListener('mouseenter', () => {
      const fills = orbCard.querySelectorAll('.signal-sample-fill');
      // Snap to 0 instantly (no transition)
      fills.forEach(fill => {
        fill.style.transition = 'none';
        fill.style.width = '0';
      });
      // Re-enable transition and expand
      requestAnimationFrame(() => requestAnimationFrame(() => {
        fills.forEach((fill, i) => {
          fill.style.transition = '';
          fill.style.transitionDelay = [0.05, 0.2, 0.35][i] + 's';
          fill.style.width = fill.dataset.width + '%';
        });
      }));
    });
  }

  // ─── Chat widget ──────────────────────────────────────────────────────────

  const messagesEl = document.getElementById('signal-messages');
  const form = document.getElementById('signal-form');
  const input = document.getElementById('signal-input');
  const sendBtn = form ? form.querySelector('.signal-send') : null;

  if (!messagesEl || !form || !input || !sendBtn) return;

  const OPENERS = {
    recruiter: "Hi — I'm Signal, an AI built on Erik's actual work history. What role are you hiring for? I can tell you honestly where he'd be a strong fit (and where he wouldn't be).",
    founder:   "Hey — I'm Signal. I can tell you what Erik has built, what worked, and where his experience might overlap with what you're working on. What are you building?",
    builder:   "Hey — I'm Signal. Erik builds agentic AI systems with Claude, designs behavioral health products, and writes real code. What are you working on?",
    curious:   "Hey — I'm Signal. I'm an AI built on Erik's work history, spanning neuroscience research, enterprise product, clinical therapy, and agentic AI. What brings you here?"
  };

  // ─── Persona selection ───────────────────────────────────────────────────

  document.querySelectorAll('.signal-persona-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      document.querySelectorAll('.signal-persona-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const isFirst = !persona;
      persona = btn.dataset.persona;

      // Enable input
      input.disabled = false;
      sendBtn.disabled = false;
      if (isFirst) input.focus();

      // Clear and show opener on first selection, or just switch context
      if (isFirst) {
        clearMessages();
        const opener = OPENERS[persona] || OPENERS.curious;
        appendMessage('assistant', opener);
        chatHistory = [{ role: 'assistant', content: opener }];
      } else {
        // Persona switch mid-conversation — note it subtly
        const note = OPENERS[persona] || OPENERS.curious;
        chatHistory = [];
        clearMessages();
        appendMessage('assistant', note);
        chatHistory = [{ role: 'assistant', content: note }];
      }
    });
  });

  // ─── Form submit ─────────────────────────────────────────────────────────

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || !persona) return;

    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

    const thinkingEl = appendThinking();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, message: text, chatHistory: chatHistory.slice(0, -1) })
      });

      const data = await res.json();
      thinkingEl.remove();

      if (!res.ok || !data.success) {
        appendMessage('assistant', 'Sorry, something went wrong. Try again in a moment.');
      } else {
        appendMessage('assistant', data.response);
        chatHistory.push({ role: 'assistant', content: data.response });
        if (data.overlap) appendOverlap(data.overlap);
      }
    } catch {
      thinkingEl.remove();
      appendMessage('assistant', 'Network error — are you offline?');
    }

    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  });

  // ─── DOM helpers ──────────────────────────────────────────────────────────

  function clearMessages() {
    messagesEl.innerHTML = '';
  }

  function appendMessage(role, content) {
    const el = document.createElement('div');
    el.className = `signal-message signal-message--${role}`;
    el.textContent = content;
    messagesEl.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return el;
  }

  function appendThinking() {
    const el = document.createElement('div');
    el.className = 'signal-message signal-message--assistant signal-message--thinking';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return el;
  }

  function appendOverlap(overlap) {
    const el = document.createElement('div');
    el.className = 'signal-overlap';
    el.innerHTML = `
      <div class="signal-overlap-score">
        <span class="signal-overlap-label">Overlap</span>
        <span class="signal-overlap-value">${overlap.score}<span class="signal-overlap-denom">/10</span></span>
      </div>
      <p class="signal-overlap-reason">${overlap.reason}</p>
    `;
    messagesEl.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
