(() => {
  'use strict';

  const config = window.PORTFOLIO_CONFIG || {};
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const themeIcon = themeButton?.querySelector('[data-theme-icon]');
  const mobileButton = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const profileImage = document.querySelector('[data-profile-image]');
  const profileFrame = document.querySelector('[data-profile-frame]');
  const profileFallback = document.querySelector('[data-portrait-fallback]');
  const themeMedia = window.matchMedia?.('(prefers-color-scheme: dark)');

  // Profile image fallback prevents a broken asset from leaving an empty frame.
  if (profileImage && profileFrame && profileFallback) {
    const showPortrait = () => {
      profileFrame.classList.add('has-profile-image');
      profileFallback.hidden = true;
      profileImage.hidden = false;
    };
    const showPortraitFallback = () => {
      profileFrame.classList.remove('has-profile-image');
      profileFallback.hidden = false;
      profileImage.hidden = true;
    };
    if (profileImage.complete) {
      if (profileImage.naturalWidth > 0) showPortrait();
      else showPortraitFallback();
    }
    profileImage.addEventListener('load', showPortrait, { once: true });
    profileImage.addEventListener('error', showPortraitFallback, { once: true });
  }

  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach(node => { node.textContent = String(value); });
  };
  setText('[data-profile-name]', config.name || 'Prabhansh Tiwari');
  setText('[data-current-year]', config.year || new Date().getFullYear());

  const setHref = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach(node => { node.href = value; });
  };
  setHref('[data-email]', config.email ? `mailto:${config.email}` : '');
  document.querySelectorAll('[data-email][data-email-label]').forEach(node => {
    if (config.email) node.textContent = config.email;
  });
  setHref('[data-github]', config.github);
  setHref('[data-linkedin]', config.linkedin);
  setHref('[data-devto]', config.devto);
  setHref('[data-resume]', config.resumeUrl);

  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    const isDark = next === 'dark';
    if (themeButton) {
      const label = `Switch to ${isDark ? 'light' : 'dark'} theme`;
      themeButton.setAttribute('aria-label', label);
      themeButton.title = label;
    }
    if (themeIcon) themeIcon.textContent = isDark ? '☼' : '◐';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = isDark ? '#121915' : '#efeee6';
  }

  const readSavedTheme = () => {
    try { return localStorage.getItem('portfolio-theme'); }
    catch (_) { return null; }
  };
  const savedTheme = readSavedTheme();
  applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (themeMedia?.matches ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('portfolio-theme', next); } catch (_) { /* theme still works for this visit */ }
  });
  themeMedia?.addEventListener?.('change', event => {
    if (readSavedTheme() !== 'dark' && readSavedTheme() !== 'light') applyTheme(event.matches ? 'dark' : 'light');
  });

  if (mobileButton && mobileNav) {
    const closeMenu = ({ returnFocus = false } = {}) => {
      mobileNav.hidden = true;
      mobileButton.setAttribute('aria-expanded', 'false');
      mobileButton.setAttribute('aria-label', 'Open navigation');
      mobileButton.title = 'Open navigation';
      const icon = mobileButton.querySelector('[data-menu-icon]');
      if (icon) icon.textContent = '☰';
      if (returnFocus) mobileButton.focus();
    };
    mobileButton.addEventListener('click', () => {
      const open = mobileNav.hidden;
      mobileNav.hidden = !open;
      mobileButton.setAttribute('aria-expanded', String(open));
      mobileButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mobileButton.title = open ? 'Close navigation' : 'Open navigation';
      const icon = mobileButton.querySelector('[data-menu-icon]');
      if (icon) icon.textContent = open ? '×' : '☰';
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileNav.hidden) closeMenu({ returnFocus: true });
    });
    document.addEventListener('pointerdown', event => {
      if (!mobileNav.hidden && !mobileNav.contains(event.target) && !mobileButton.contains(event.target)) closeMenu();
    });
    const desktopMedia = window.matchMedia?.('(min-width: 761px)');
    desktopMedia?.addEventListener?.('change', event => { if (event.matches) closeMenu(); });
  }
})();
