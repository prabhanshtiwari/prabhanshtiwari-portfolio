/* Set the preferred colour scheme before the stylesheet is parsed. */
(() => {
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let saved = null;
  try { saved = window.localStorage.getItem('portfolio-theme'); } catch (_) { /* storage may be disabled */ }
  root.dataset.theme = saved === 'dark' || saved === 'light' ? saved : (media && media.matches ? 'dark' : 'light');
})();
