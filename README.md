# BEYOND THE CLASS — Interactive Portfolio

An experimental, RPG-inspired personal portfolio: **One mind. Five disciplines.**

## Stage 01 — Interactive landing page

This first stage establishes the visual composition and user interaction before the final Blender models are built.

- Dramatic dragon-versus-five-heroes scene (temporary vector illustration).
- Five selectable characters: **Mage** (AI / innovation), **Warrior** (exhibitions / physical delivery), **Ranger** (architecture / spatial design), **Healer** (independent / interdisciplinary work), and **Warlock** (web / product strategy).
- Hover/focus awakening and gentle camera parallax.
- Click-to-cast spell transitions, leading to temporary portfolio archive screens.
- Recruiter-friendly **Quick View**, keyboard support, ESC-to-close, reduced-motion option, and responsive styling.

## Run locally

Open **index.html** directly in a modern browser. This standalone file embeds the prototype's styles, JavaScript and SVG artwork, so no build tools or additional files are necessary.

## Publish on GitHub Pages

In **Settings → Pages**, select **Deploy from a branch → main / (root)**. The default landing page is **index.html**.

## Roadmap

1. Refine layout, character locations and camera interaction.
2. Model and animate the first hero in Blender; export to glTF/GLB.
3. Integrate Blender assets with Web 3D and build the first fully realized skill book.
4. Implement the remaining hero classes, page systems and production project content.

*All chapter items in this stage are placeholders. They are not claims of completed client projects.*


## Stage 02 — Mage visual anchor and Blender blockout starter

The **Mage / Rift Observer** visual direction was approved on 2026-11-03.

- [Approved appearance & constraints](docs/characters/mage-visual-approved.md)
- [Full visual design brief](docs/characters/mage.md)
- [Blender blockout generator](tools/blender/build_mage_blockout.py)

Run this from the repository root with Blender 4.x installed:

```sh
blender --background --python tools/blender/build_mage_blockout.py
```

The script is a **rough static silhouette starter**, not a final mesh, rig or animated game character. It aims to produce a Blender scene, GLB and three preview angles under `assets/`. It was syntax-checked, but **not executed in Blender in the creation environment**; its outputs and compatibility must be tested locally before being treated as completed assets.
