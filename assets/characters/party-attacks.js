/* Preload attack poses so the first click has the same feedback as later clicks. */
for (const role of ['warrior', 'ranger', 'healer', 'warlock']) {
  const image = new Image();
  image.src = `./assets/characters/${role}/${role}_attack.png`;
}
