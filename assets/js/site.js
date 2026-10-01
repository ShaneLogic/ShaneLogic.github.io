(() => {
  'use strict';

  window.lucide?.createIcons();
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  const closeNavigation = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      navToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeNavigation();
  });
  window.matchMedia('(min-width: 741px)').addEventListener('change', closeNavigation);

  const toast = document.getElementById('site-status');
  let toastTimer;
  function announce(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
  }

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const citation = document.getElementById(button.dataset.copyTarget);
      try {
        await navigator.clipboard.writeText(citation.textContent.trim() + '\n');
        announce('BibTeX citation copied.');
      } catch {
        citation.hidden = false;
        announce('Clipboard unavailable. BibTeX citation expanded.');
      }
    });
  });

  const form = document.querySelector('.publication-filters');
  if (form) {
    const search = document.getElementById('publication-search');
    const year = document.getElementById('publication-year');
    const topic = document.getElementById('publication-topic');
    const papers = Array.from(document.querySelectorAll('[data-publication]'));
    const count = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    const normalize = (value) => value.normalize('NFKD').toLowerCase().replace(/\s+/g, ' ').trim();
    const texts = new Map(papers.map((paper) => [paper, normalize(paper.dataset.search)]));
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    year.value = params.get('year') || '';
    topic.value = params.get('topic') || '';

    function filter(updateUrl = true) {
      const words = normalize(search.value).split(' ').filter(Boolean);
      let visible = 0;
      papers.forEach((paper) => {
        const matches = (!year.value || paper.dataset.year === year.value)
          && (!topic.value || paper.dataset.topic === topic.value)
          && words.every((word) => texts.get(paper).includes(word));
        paper.hidden = !matches;
        if (matches) visible += 1;
      });
      document.querySelectorAll('[data-year-group]').forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll('[data-publication]')).some((paper) => !paper.hidden);
      });
      count.textContent = `${visible} publication${visible === 1 ? '' : 's'}`;
      noResults.hidden = visible !== 0;
      if (updateUrl) {
        const url = new URL(location.href);
        [['q', search.value.trim()], ['year', year.value], ['topic', topic.value]].forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value);
          else url.searchParams.delete(key);
        });
        history.replaceState(null, '', url);
      }
    }
    function reset() {
      search.value = '';
      year.value = '';
      topic.value = '';
      filter();
      search.focus();
    }
    search.addEventListener('input', () => filter());
    year.addEventListener('change', () => filter());
    topic.addEventListener('change', () => filter());
    form.addEventListener('submit', (event) => event.preventDefault());
    form.addEventListener('reset', (event) => { event.preventDefault(); reset(); });
    document.querySelector('[data-reset-search]').addEventListener('click', reset);
    filter(false);
  }

  const dialog = document.getElementById('image-dialog');
  const dialogImage = document.getElementById('image-dialog-content');
  const caption = document.getElementById('image-dialog-caption');
  let imageTrigger;
  document.querySelectorAll('[data-image]').forEach((button) => {
    button.addEventListener('click', () => {
      imageTrigger = button;
      dialogImage.src = button.dataset.image;
      dialogImage.alt = button.querySelector('img').alt;
      caption.textContent = button.dataset.caption;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  dialog.querySelector('[data-close-image]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    imageTrigger?.focus();
  });
})();
