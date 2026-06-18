/* =========================================================
   mey3am.dev — main.js
   Features: typewriter effect, theme toggle (with localStorage
   fallback handled gracefully), live search + category filter,
   scroll-reveal animations, scroll-to-top button.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initTypewriter();
  initThemeToggle();
  initSearchAndFilter();
  initScrollReveal();
  initScrollTopButton();
});

/* ---------------------------------------------------------
   1. TYPEWRITER EFFECT
   Cycles through a list of phrases in the hero heading,
   typing and deleting each one character by character.
--------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Where JavaScript Is Headed',
    'Code, Curiosity, and Side Projects',
    'Built by Mey3am, One Bug at a Time'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 55;
  const deleteSpeed = 30;
  const pauseAfterType = 1800;
  const pauseAfterDelete = 400;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, pauseAfterType);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, pauseAfterDelete);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
}

/* ---------------------------------------------------------
   2. THEME TOGGLE (dark / light)
   Stores preference in memory for this session.
   Falls back gracefully if localStorage is blocked.
--------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  let theme = 'dark';
  try {
    theme = window.localStorage.getItem('mey3am-theme') || 'dark';
  } catch (e) {
    theme = 'dark';
  }

  applyTheme(theme);

  btn.addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
      window.localStorage.setItem('mey3am-theme', theme);
    } catch (e) {
      /* localStorage unavailable — theme just won't persist on reload */
    }
  });

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (icon) icon.textContent = t === 'dark' ? '🌙' : '☀️';
  }
}

/* ---------------------------------------------------------
   3. LIVE SEARCH + CATEGORY FILTER
   Filters post cards as the user types or clicks a tag,
   combining both conditions together.
--------------------------------------------------------- */
function initSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const filterTags = document.querySelectorAll('.filter-tag');
  const postCols = document.querySelectorAll('.post-col');
  const noResults = document.getElementById('noResults');
  const postCount = document.getElementById('postCount');

  if (!searchInput || postCols.length === 0) return;

  let activeCategory = 'all';

  function runFilter() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    postCols.forEach(function (col) {
      const category = col.getAttribute('data-category');
      const title = (col.getAttribute('data-title') || '').toLowerCase();
      const excerpt = (col.getAttribute('data-excerpt') || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = query === '' || title.includes(query) || excerpt.includes(query);

      const isVisible = matchesCategory && matchesSearch;
      col.classList.toggle('d-none', !isVisible);
      if (isVisible) visibleCount++;
    });

    if (noResults) noResults.classList.toggle('d-none', visibleCount !== 0);
    if (postCount) postCount.textContent = '(' + visibleCount + ')';
  }

  searchInput.addEventListener('input', runFilter);

  filterTags.forEach(function (tag) {
    tag.addEventListener('click', function () {
      filterTags.forEach(function (t) { t.classList.remove('active'); });
      tag.classList.add('active');
      activeCategory = tag.getAttribute('data-filter');
      runFilter();
    });
  });

  runFilter();
}

/* ---------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver to fade/slide elements into
   view as the user scrolls down the page.
--------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('reveal-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { observer.observe(el); });
}

/* ---------------------------------------------------------
   5. SCROLL-TO-TOP BUTTON
   Shows once the user scrolls past the hero section.
--------------------------------------------------------- */
function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
