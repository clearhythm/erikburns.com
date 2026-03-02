# erikburns.com Site Refresh — 2026

## Context for Autonomous Agent

### Project Stack
- **11ty v3**, Nunjucks templates, SCSS (compiled via dart-sass CLI), vanilla JS
- **Dev:** `npm start` → `concurrently "sass --watch src/assets/styles/main.scss:src/assets/css/main.css" "eleventy --serve"`
- **Build:** `npm run build:css && npx @11ty/eleventy`
- **Output dir:** `dist/`
- **Hosting:** Netlify

### Key Files
- `src/index.njk` — all page content (single page)
- `src/_layout/base.njk` — HTML shell, Google Fonts, theme toggle JS
- `src/_include/nav.njk` — navbar + hamburger sidemenu
- `src/assets/styles/components/_landing.scss` — all section/hero styles
- `src/assets/styles/components/_navbar.scss` — nav styles
- `src/assets/styles/utils/_variables.scss` — color/spacing/font tokens
- `src/assets/js/typewriter.js` — blur-swap word cycling animation
- `src/assets/css/main.css` — compiled CSS output (do not edit directly)

### Design Tokens (current, in `_variables.scss`)
```scss
$color-primary: #2563eb;
$color-text: #5b21b6;         // expressive purple — headings + logotype
$color-text-muted: #555;      // slate body copy
$color-bg: #ffffff;
$color-bg-muted: #f3f4f6;
$color-border: #e5e7eb;
$dark-color-text: #e5e7eb;
$dark-color-bg: #1f2937;
$font-heading: 'Copernicus', Garamond, Georgia, serif;
$font-body: 'Poppins', Helvetica, sans-serif;
```

### Current Page Structure (in `src/index.njk`)
1. Hero — word-cycle headline + tagline + CTAs
2. "The Arc" — prose bio
3. "The Story" (HabitualOS Story) — 3-beat narrative with story images
4. "Work" — 3 work cards (HabitualOS, Healify, Enterprise)
5. "Writing" — article links
6. "Elsewhere" — social links

---

## Changes Required

### 1. Copy Image Assets

Copy these files into `src/assets/img/`:

**From HabitualOS** (`/Users/erik/Sites/habitualos/apps/habitualos-web/src/images/`):
- `habitualos-screenshot.png` → `src/assets/img/habitualos-screenshot.png`
- `habitual-1.png` → `src/assets/img/habitual-1.png`
- `habitual_story_1b.png` → `src/assets/img/habitual_story_1b.png`
- `habitual_story_2b.png` → `src/assets/img/habitual_story_2b.png`
- `habitual_story_3b.png` → `src/assets/img/habitual_story_3b.png`

**From Healify** (`/Users/erik/Sites/healify-phoenix/src/assets/img/`):
- `screenshots/screenshot-desktop.png` → `src/assets/img/healify-screenshot.png`

Use `cp` commands to do this.

---

### 2. Update Section Background Colors (`_landing.scss`)

**Current** (heavy purple bands, white text):
```scss
.section {
  padding: $space-2xl 0;
  scroll-margin-top: 80px;
  background: #2a1265;
  color: rgba(255, 255, 255, 0.85);

  &:nth-child(even) {
    background: #3a1a7a;
  }
}
```

**Replace with** (light alternating, dark purple text):
```scss
.section {
  padding: 4rem 0 7rem;
  scroll-margin-top: 80px;
  background: #ffffff;
  color: $color-text-muted;

  &:nth-child(even) {
    background: #f7f5ff;
  }

  html[data-theme="dark"] & {
    background: #0d0d18;
    color: $dark-color-text;

    &:nth-child(even) {
      background: #11101f;
    }
  }
}
```

**Also update these related styles** (they currently assume dark purple backgrounds):

```scss
// Section label — was #93c5fd (light blue on dark); change to primary blue on light
.section-label {
  color: $color-primary;

  html[data-theme="dark"] & {
    color: #93c5fd;
  }
}

// Section title — was #fff; change to $color-text (expressive purple)
.section-title {
  color: $color-text;

  html[data-theme="dark"] & {
    color: $dark-color-text;
  }
}

// Section intro
.section-intro {
  color: $color-text-muted;

  html[data-theme="dark"] & {
    color: $dark-color-text-muted;
  }
}

// Arc prose
.arc-prose p {
  color: $color-text-muted;

  html[data-theme="dark"] & {
    color: $dark-color-text;
  }
}

// Work cards — remove the glassy overlay, use a standard card style
.work-card {
  background: $color-bg-muted;
  border: 1px solid $color-border;
  border-radius: 12px;
  padding: $space-xl;
  margin-bottom: $space-lg;

  &:last-child { margin-bottom: 0; }

  html[data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }
}

.work-name {
  color: $color-text;

  html[data-theme="dark"] & {
    color: $dark-color-text;
  }
}

.work-role {
  color: $color-text-muted;

  html[data-theme="dark"] & {
    color: $dark-color-text-muted;
  }
}

.work-description p {
  color: $color-text-muted;
  line-height: 1.75;

  html[data-theme="dark"] & {
    color: $dark-color-text;
  }
}

// Work details — labels and list items
.work-details {
  h4 {
    color: $color-text-muted;
  }

  li {
    color: $color-text-muted;
    border-bottom-color: $color-border;

    &::before {
      color: $color-primary;
    }

    html[data-theme="dark"] & {
      color: $dark-color-text-muted;
      border-bottom-color: rgba(255, 255, 255, 0.08);

      &::before {
        color: #93c5fd;
      }
    }
  }
}

// Writing items
.writing-item {
  border-bottom-color: $color-border;

  a {
    color: $color-text;

    html[data-theme="dark"] & {
      color: $dark-color-text;
    }
  }
}

.writing-meta {
  color: $color-text-muted;

  html[data-theme="dark"] & {
    color: $dark-color-text-muted;
  }
}

// Elsewhere
.elsewhere-label {
  color: $color-text-muted;

  html[data-theme="dark"] & {
    color: $dark-color-text-muted;
  }
}
```

---

### 3. Add Work Card Screenshot Layout to `_landing.scss`

Add this new CSS for screenshot-enabled work cards:

```scss
// Work card with screenshot
.work-card-media {
  margin-bottom: $space-md;

  @media (min-width: $breakpoint-lg) {
    margin-bottom: 0;
  }
}

.work-card-screenshot {
  width: 100%;
  border-radius: 8px;
  border: 1px solid $color-border;
  display: block;
  object-fit: cover;
  object-position: top;
  max-height: 280px;

  html[data-theme="dark"] & {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

// Work body: when a screenshot is present, use a 3-column grid (media + content)
.work-card.has-screenshot {
  .work-body {
    @media (min-width: $breakpoint-lg) {
      grid-template-columns: 1fr 2fr;
    }
  }
}
```

Also add `.work-card-link` style:
```scss
.work-card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-primary;
  text-decoration: none;
  margin-top: $space-md;

  &::after { content: " ↗"; }
  &:hover { text-decoration: underline; }

  html[data-theme="dark"] & {
    color: #93c5fd;
  }
}
```

---

### 4. Add "Principles" / "How I Think" section styles to `_landing.scss`

```scss
// How I Think — principles grid
.principles-grid {
  display: grid;
  gap: $space-lg;
  margin-top: $space-xl;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: 1fr 1fr;
  }
}

.principle {
  padding: $space-lg;
  border-left: 3px solid $color-text;
  background: rgba(91, 33, 182, 0.04);
  border-radius: 0 8px 8px 0;

  html[data-theme="dark"] & {
    border-left-color: #7c3aed;
    background: rgba(124, 58, 237, 0.08);
  }
}

.principle-title {
  font-family: $font-heading;
  font-size: $font-size-xl;
  font-weight: 400;
  color: $color-text;
  margin-bottom: $space-sm;

  html[data-theme="dark"] & {
    color: $dark-color-text;
  }
}

.principle-body {
  font-size: $font-size-base;
  line-height: 1.7;
  color: $color-text-muted;
  margin: 0;

  html[data-theme="dark"] & {
    color: $dark-color-text-muted;
  }
}
```

---

### 5. Rewrite `src/index.njk` — Full Page Content

Replace the entire content of `src/index.njk` with the following. The front matter (layout, title, description) stays the same.

```njk
---
layout: base.njk
title: Erik Burns — Product, Health & Agentic AI
description: Product and UX leader building systems where AI handles operational work so humans can focus on wellness, strategy, and care. 100M+ users, clinical practice, production agentic AI.
---

<!-- Hero -->
<section class="hero">
  <div class="hero-content">
    <h1 class="hero-headline"><span class="cycle-word">Wellness</span><br>Made Agentic</h1>
    <p class="hero-tagline">
      Product, health tech, and agentic AI — built and used in the same life.
    </p>
    <div class="hero-cta">
      <a href="#arc" class="btn btn-primary">See the Work</a>
      <a href="https://linkedin.com/in/erikburns" class="btn btn-ghost" target="_blank" rel="noopener">
        Connect on LinkedIn
      </a>
    </div>
  </div>
  <div class="hero-scroll" aria-hidden="true">
    <span>scroll</span>
    <span>↓</span>
  </div>
</section>

<!-- The Arc -->
<section class="section" id="arc">
  <div class="container-narrow">
    <p class="section-label">The Arc</p>
    <h2 class="section-title">Neuroscience, enterprise product, clinical practice, and agentic AI.</h2>

    <div class="arc-prose">
      <p>
        I studied biological sciences at Stanford — ranked first in my class, Beckman Scholar,
        published in two journals across neuroscience and cognitive science. That foundation
        shapes everything about how I think about human behavior, motivation, and the systems
        that influence both.
      </p>
      <p>
        I spent fifteen years building digital products for companies like Apple, Intuit,
        Realtor.com, and Capital One — consumer and enterprise products used by tens of
        millions of people. The work was real and measured: a 14% lift in paid conversions
        at Realtor.com ($45M incremental revenue), a 20% reduction in support calls at Intuit,
        a 300% ROI increase for Capital One. Products that shipped and moved numbers.
      </p>
      <p>
        Then I founded Healify — a behavioral health platform for therapists and clients to
        measure progress together. It delivered over one million mood assessments. In 2024,
        I stepped away from the product to work directly with patients as a somatic therapist,
        treating chronic pain, anxiety, and stress through hypnotherapy and nervous system
        regulation. That clinical work taught me things about human motivation, resistance,
        and behavior change that no user research method had.
      </p>
      <p>
        That clinical experience drove a full rebuild of Healify in 2025 — and shapes
        everything about how I think about HabitualOS, an agentic AI platform I've built
        and used daily since 2024. The through-line from Stanford to the clinic to
        production AI is the same question: what does it actually take to change
        what a person does tomorrow morning?
      </p>
    </div>
  </div>
</section>

<!-- How I Think -->
<section class="section" id="principles">
  <div class="container">
    <p class="section-label">How I Think</p>
    <h2 class="section-title">Principles I build from</h2>
    <p class="section-intro">
      These aren't values I wrote down. They're constraints I discovered by shipping
      things, treating patients, and running agents that had to work by Monday.
    </p>

    <div class="principles-grid">
      <div class="principle">
        <h3 class="principle-title">Behavior first, interface second</h3>
        <p class="principle-body">
          Most product failures are behavior problems. Twenty-five years of shipping
          and a clinical practice confirmed it: the interface is rarely the real
          constraint. Understanding what drives and blocks behavior is the design brief.
        </p>
      </div>

      <div class="principle">
        <h3 class="principle-title">Build what you use</h3>
        <p class="principle-body">
          HabitualOS exists because I needed it. Every failure mode I hit became
          a design constraint. Every friction point became a feature requirement.
          There is no shortcut to product-market fit as reliable as being
          the actual user.
        </p>
      </div>

      <div class="principle">
        <h3 class="principle-title">Science is the brief</h3>
        <p class="principle-body">
          Neuroscience, clinical hypnotherapy, and behavioral health research aren't
          background — they're how I frame every design problem. The brain is the
          product manager. Everything else is implementation.
        </p>
      </div>

      <div class="principle">
        <h3 class="principle-title">Agents amplify, humans decide</h3>
        <p class="principle-body">
          Agentic AI is most powerful when it handles operational overhead and
          frees humans for the judgments that actually require them. I design systems
          that know the difference — structured, auditable, and human-in-the-loop
          where it counts.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Work -->
<section class="section" id="work">
  <div class="container">
    <p class="section-label">Work</p>
    <h2 class="section-title">What I've built</h2>

    <!-- HabitualOS -->
    <div class="work-card has-screenshot">
      <div class="work-body">
        <div class="work-card-media">
          <img class="work-card-screenshot" src="/assets/img/habitualos-screenshot.png" alt="HabitualOS app screenshot">
        </div>
        <div>
          <div class="work-card-header">
            <h3 class="work-name">HabitualOS</h3>
            <p class="work-role">Agentic AI platform — productivity and habit tracking</p>
          </div>
          <div class="work-description">
            <p>
              A multi-agent system that handles the operational overhead of daily work.
              Specialized agents manage task creation and scheduling, practice tracking,
              progress monitoring, and daily check-ins — using a typed signal protocol
              that keeps agent behavior constrained and auditable.
            </p>
            <p>
              I'm the primary user. That's the design constraint that matters most.
            </p>
          </div>
          <div class="work-details">
            <h4>Technical patterns</h4>
            <ul>
              <li>Multi-agent orchestration with typed signal protocol</li>
              <li>Tool use: autonomous task retrieval and update</li>
              <li>Prompt caching for high-frequency interactions</li>
              <li>Long-context memory for session continuity</li>
            </ul>
          </div>
          <a href="https://habitualos.com" class="work-card-link" target="_blank" rel="noopener">habitualos.com</a>
        </div>
      </div>
    </div>

    <!-- Healify -->
    <div class="work-card has-screenshot">
      <div class="work-body">
        <div class="work-card-media">
          <img class="work-card-screenshot" src="/assets/img/healify-screenshot.png" alt="Healify app screenshot">
        </div>
        <div>
          <div class="work-card-header">
            <h3 class="work-name">Healify</h3>
            <p class="work-role">Behavioral health platform — founded 2020, rebuilt 2025</p>
          </div>
          <div class="work-description">
            <p>
              A privacy-first platform enabling therapists and clients to meaningfully
              measure progress together. Over one million mood assessments served.
              A 260% increase in reported client satisfaction.
            </p>
            <p>
              After a year of treating patients directly as a clinical hypnotherapist,
              I rebuilt the platform in 2025 — this time grounded in what actually
              happens in therapeutic relationships, not just what looks good in user flows.
            </p>
          </div>
          <div class="work-details">
            <h4>Platform scale</h4>
            <ul>
              <li>1M+ mood assessments delivered</li>
              <li>260% increase in client satisfaction scores</li>
              <li>Privacy-first data model (fully user-partitioned)</li>
              <li>100+ patients treated in clinical practice</li>
            </ul>
          </div>
          <a href="https://healifyapp.com" class="work-card-link" target="_blank" rel="noopener">healifyapp.com</a>
        </div>
      </div>
    </div>

    <!-- Enterprise -->
    <div class="work-card">
      <div class="work-card-header">
        <h3 class="work-name">Enterprise Product</h3>
        <p class="work-role">Apple · Realtor.com · Intuit · Capital One · and others</p>
      </div>
      <div class="work-body">
        <div class="work-description">
          <p>
            Fifteen years leading product design and strategy for consumer and enterprise
            products at named companies. Products used by tens of millions of people,
            with documented business impact.
          </p>
          <p>
            At Tangible (SF design consultancy), I led engagements across Capital One,
            Intuit, and Apple. Before that, independent consulting for clients including
            Xerox PARC, Symantec, Webex, Citrix, and Zurb.
          </p>
        </div>
        <div class="work-details">
          <h4>Measured outcomes</h4>
          <ul>
            <li>Realtor.com: 14% lift in paid conversions ($45M revenue)</li>
            <li>Intuit: 20% reduction in support calls (impact award)</li>
            <li>Capital One: 300% ROI increase, novel B2B credit app</li>
            <li>PARC: 12% revenue increase for LADOT solution</li>
          </ul>
          <h4>Scope</h4>
          <ul>
            <li>Products used by 100M+ people</li>
            <li>Cross-functional team leadership</li>
            <li>Consumer and enterprise contexts</li>
            <li>Concept through development hand-off</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- Writing -->
<section class="section" id="writing">
  <div class="container-narrow">
    <p class="section-label">Writing</p>
    <h2 class="section-title">Articles and notes</h2>
    <p class="section-intro">
      I write about what I learn building these systems. Most of it lives on LinkedIn.
    </p>
    <ul class="writing-list">
      <li class="writing-item">
        <a href="https://www.linkedin.com/pulse/zero-gravity-semantic-microformat-ai-parseable-content-erik-burns" target="_blank" rel="noopener">
          Zero Gravity: A Semantic Microformat for AI-Parseable Content
        </a>
        <p class="writing-meta">February 2026 · On building structured metadata that preserves document readability while giving AI agents real context</p>
      </li>
      <li class="writing-item">
        <a href="https://linkedin.com/in/erikburns" target="_blank" rel="noopener">
          More on LinkedIn
        </a>
        <p class="writing-meta">Agentic AI, conversational UX, and building with Claude</p>
      </li>
    </ul>
  </div>
</section>

<!-- Elsewhere -->
<section class="section" id="elsewhere">
  <div class="container-narrow">
    <p class="section-label">Elsewhere</p>
    <h2 class="section-title">Find me</h2>
    <ul class="elsewhere-list">
      <li class="elsewhere-item">
        <span class="elsewhere-label">LinkedIn</span>
        <a class="elsewhere-link" href="https://linkedin.com/in/erikburns" target="_blank" rel="noopener">linkedin.com/in/erikburns</a>
      </li>
      <li class="elsewhere-item">
        <span class="elsewhere-label">Podcast</span>
        <a class="elsewhere-link" href="https://feelinggood.com/2025/02/10/435-meet-erik-burns/" target="_blank" rel="noopener">Feeling Good with David Burns — Hypnosomatics</a>
      </li>
      <li class="elsewhere-item">
        <span class="elsewhere-label">HabitualOS</span>
        <a class="elsewhere-link" href="https://habitualos.com" target="_blank" rel="noopener">habitualos.com</a>
      </li>
      <li class="elsewhere-item">
        <span class="elsewhere-label">Email</span>
        <a class="elsewhere-link" href="mailto:erik@erikburns.com">erik@erikburns.com</a>
      </li>
    </ul>
  </div>
</section>
```

---

### 6. Update Sidemenu Navigation (`src/_include/nav.njk`)

Add the new `#principles` section link to the sidemenu:

```html
<li><h3><a href="#arc">The Arc</a></h3></li>
<li><h3><a href="#principles">How I Think</a></h3></li>
<li><h3><a href="#work">Work</a></h3></li>
<li><h3><a href="#writing">Writing</a></h3></li>
<li><h3><a href="#elsewhere">Elsewhere</a></h3></li>
```

---

## Execution Order

1. **Copy images** (step 1) — required before testing page
2. **Update `src/index.njk`** — full replacement with content above (step 5)
3. **Update `src/_include/nav.njk`** — add principles link (step 6)
4. **Update `_landing.scss`** — all style changes (steps 2, 3, 4)
5. **Build and verify** — run `npm run build:css && npx @11ty/eleventy` and confirm no errors

---

## Verification Checklist

- [ ] `src/assets/img/habitualos-screenshot.png` exists
- [ ] `src/assets/img/healify-screenshot.png` exists
- [ ] Section backgrounds are light white/off-white (not dark purple)
- [ ] Section titles render in `$color-text` (purple) not white
- [ ] Work cards for HabitualOS and Healify have screenshot images on the left column
- [ ] New "How I Think" section renders with 4 principles in a 2-column grid
- [ ] Sidemenu includes "How I Think" link
- [ ] `habitualos.com` and `healifyapp.com` links appear on respective work cards
- [ ] Dark mode still works (toggle in sidemenu)
- [ ] No SCSS compile errors
- [ ] `dist/index.html` built successfully

---

## Notes for Agent

- **Do not modify** `src/assets/styles/utils/_variables.scss` — all tokens are already correct
- **Do not modify** `.eleventy.js`, `package.json`, or `netlify.toml`
- **Do not modify** `src/_layout/base.njk` or `src/assets/js/typewriter.js`
- The hero section CSS (orbs, scroll indicator, word-cycle animation) stays unchanged
- The navbar SCSS stays unchanged
- When editing `_landing.scss`, be careful to replace only the specific rule blocks listed — don't remove the hero rules, animation keyframes, `.btn` rules, or responsive container rules
- The `work-body` grid (`.work-body`) already exists in the SCSS with `grid-template-columns: 1.2fr 1fr` at `$breakpoint-lg`. For `.has-screenshot` cards, this should change to `1fr 2fr` (image narrower, text wider). Update that rule.
