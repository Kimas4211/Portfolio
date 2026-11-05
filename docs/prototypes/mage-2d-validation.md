# Stage 02 — Mage 2D billboard validation (2026-11-05)

**Direction decided:** the dragon environment and stage can use 3D; hero portraits do not need full 3D skeletal models. Real portfolio case studies remain the focus.

## What changed
- `assets/characters/mage-2d-prototype.svg`: temporary full-body vector illustration of Mage 01, inspired by the approved silver-haired, navy robe, asymmetric mantle, antique gold staff with blue crystal.
- `assets/characters/mage-2d.css`: two visually identical image layers; bottom layer is a dark silhouette, upper layer is colored and fades in on hover/focus. A restrained glow is applied to the existing hover state.
- `index.html`: mage-only billboard integration and tiny pointer-driven offset (max ~3 px horizontally, ~2 px vertically). Existing hero button, accessibility label, role selection and cast/archive logic remain.
- Warrior / Ranger / Healer / Warlock remain the original Stage 01 SVG placeholders.

## Validation checklist
1. At initial page load the mage is a dark silhouette (just like the other heroes).
2. Hover or keyboard focus reveals the same character in color without changing the silhouette geometry.
3. Mouse movement gives subtle positional parallax; the role stays clickable.
4. Click still opens Mage archive after its Stage 01 casting transition.
5. Other four roles remain clickable, and Quick View works.
6. Reduced-motion settings and mobile widths still provide usable navigation.
7. At actual homepage viewing size, staff silhouette and asymmetric mantle remain recognisable.

## Important limitations
- The included vector mage is an **original temporary test illustration**, not a final painting and not a faithful recreation of the approved cinematic concept sheet.
- This pass is a **2D billboard using 2.5D-style parallax**, not a fully layered puppet rig, not real-time 3D and not integrated with Blender camera/depth/occlusion.
- Browser visuals and GitHub Pages deployment have not been visually tested in this task environment; conduct a desktop and mobile preview before approving.
- Existing Blender Mage 01 blockout should be kept as dimension, pose and framing reference; it does not need further high-poly modelling.

## Next
- Evaluate the 2D hover test with a live browser screenshot.
- Replace prototype SVG with a higher-quality matching transparent full-body asset, preserving both silhouette and color from the *same* artwork.
- If the scene requires foreground occlusion or genuine depth response, split mage art into staff, arm, body, hair, and mantle layers, and place them on a simple 3D billboard plane or HTML layers with controlled parallax.
- Connect skills transitions to project data only after the scene concept is approved.

## Source / review
- `docs/characters/mage-visual-approved.md` is the character's visual reference.
- Keep scope limited to Mage until this test is accepted.
