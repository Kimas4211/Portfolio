/* Stage 03: lightweight image preload and optional casting pose feedback. */
(() => {
  const mage = document.querySelector('.hero-character.mage');
  if (!mage) return;
  const images = [
    './assets/characters/mage/mage_idle.webp',
    './assets/characters/mage/mage_cast.webp',
  ];
  images.forEach(src => { const image = new Image(); image.src = src; });
  let castReset;
  mage.addEventListener('click', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    mage.classList.remove('is-casting');
    clearTimeout(castReset);
    mage.classList.add('is-casting');
    castReset = setTimeout(() => mage.classList.remove('is-casting'), 900);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { mage.classList.remove('is-casting'); clearTimeout(castReset); }
  });
})();
