"""Run inside the local Portfolio repository: python tools/install_stage03.py
Idempotent. Does not touch non-Mage characters, background or archive logic.
"""
from pathlib import Path
import re

repo = Path(__file__).resolve().parents[1]
index = repo / 'index.html'
css = repo / 'assets/characters/mage-stage03.css'
js = repo / 'assets/characters/mage-stage03.js'
files = [repo / f'assets/characters/mage/mage_{pose}.webp' for pose in ('idle', 'cast')]
for p in [index, css, js, *files]:
    if not p.is_file():
        raise SystemExit(f'Missing required file: {p}')
s = index.read_text(encoding='utf-8')
start = s.find('<button class="hero-character mage"')
if start < 0:
    raise SystemExit('Cannot find Mage button; index not changed')
stop = s.find('</button>', start)
if stop < 0:
    raise SystemExit('Cannot find Mage button end; index not changed')
part = s[start:stop]
if 'mage2d-stage' not in part:
    raise SystemExit('Stage 02 mage2d-stage not found; index not changed')
# Replace both existing copies with exactly the same new idle illustration.
part = part.replace('./assets/characters/mage-2d-prototype.svg','./assets/characters/mage/mage_idle.webp')
cast = '<img class="mage2d-layer mage2d-cast" src="./assets/characters/mage/mage_cast.webp" alt="" draggable="false"/>'
if 'mage2d-cast' not in part:
    needle = '<img class="mage2d-layer mage2d-color" src="./assets/characters/mage/mage_idle.webp" alt="" draggable="false"/>'
    if needle not in part:
        raise SystemExit('Expected Mage color layer not found; index not changed')
    part = part.replace(needle, needle+cast)
s = s[:start] + part + s[stop:]
if 'mage-stage03.css' not in s:
    s = s.replace('</head>', '  <link rel="stylesheet" href="./assets/characters/mage-stage03.css" />\n</head>', 1)
if 'mage-stage03.js' not in s:
    s = s.replace('</body>', '  <script defer src="./assets/characters/mage-stage03.js"></script>\n</body>', 1)
if s.count('class="hero-character ') != 5:
    raise SystemExit('Unexpected character count; index not changed')
if 'mage2d-cast' not in s or s.count('mage-stage03.css') != 1:
    raise SystemExit('Validation failure; index not changed')
index.write_text(s,encoding='utf-8')
print('Stage 03 Mage integrated. Inspect index.html and preview before git commit.')
