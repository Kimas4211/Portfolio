/* Stage 03: mage sprites are preloaded; clicking briefly reveals cast pose. */
(() => {
  const mage = document.querySelector('.hero-character.mage');
  if (!mage) return;
  ['./assets/characters/mage/mage_idle.webp','./assets/characters/mage/mage_cast.webp'].forEach(src => {
    const image = new Image();
    image.src = src;
  });
  let timer;
  mage.addEventListener('click', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearTimeout(timer);
    mage.classList.remove('is-casting');
    mage.classList.add('is-casting');
    timer = setTimeout(() => mage.classList.remove('is-casting'),900);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {clearTimeout(timer);mage.classList.remove('is-casting');}
  });
})();