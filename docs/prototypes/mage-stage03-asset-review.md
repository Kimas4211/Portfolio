# Mage 01 — Stage 03 transparent sprite review

A first transparent RGBA character sheet has been generated and cropped into three standalone WebP assets (idle, hover, cast) for local inspection.

## Current result
- Mage design: silver-white hair, dark-blue long robe, asymmetrical mantle, antique-gold circlet staff with bright blue crystal.
- Images are **art proof assets only**, not an approved final sprite rig.
- The current proof sheet includes soft magical light/glow across transparent areas and labels outside cropped bounds.
- The original mage idle image is used for **both** the silhouette and hover/color states, to keep the anatomy aligned exactly. The separate hover drawing is a visual reference only.
- A local independent test page allows state switching and slight pointer parallax; the repository homepage remains unchanged.

## Asset preparation checklist
1. Precise matte / eliminate stray glow near the silhouette (alpha edge cleanup).
2. Confirm the idle full body is never cropped, including staff tip and boots.
3. Re-export idle with shared registration and fixed foot anchor.
4. Separate head, mantle, casting arm, staff, and body from a common source image, not independently redrawn frames.
5. Introduce casting pose only with alignment and a matching transform anchor.
6. Test at the actual small five-hero homepage scale.
7. Then upload approved binary WebP/PNG assets into `assets/characters/mage/` and replace only Mage's prototype SVG references.

This document intentionally does not claim that the binary assets or a new animated homepage have already been published.
