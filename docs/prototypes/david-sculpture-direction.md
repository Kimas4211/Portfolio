# BEYOND FORM — David sculpture prototype: asset selection & interaction brief

Status: **approved creative direction; research and planning only**. The older RPG portfolio remains unchanged as a historical prototype. No David model, Blender scene or live 3D website has yet been delivered.

## Approved creative direction
- Use a recognizable, faithful Michelangelo David sculpture likeness, cropped from a full sculpture into a *complete upper torso* (head/hair, neck, shoulders, chest and back), atop a sculptural base.
- Default: completely plain grey-white stone with subtle shadowing; **no permanent colored cracks, metal ornaments or orbit**.
- Free explore: pointer leads smooth rotation around the sculpture, potentially 360 degrees; avoid pointer-induced high spin, apply inertia/damping and halt motion near precise targets.
- Hover: only the targeted, *visible* region subtly leaks its colored energy from within. The appearance varies naturally with camera angle and surface geometry.
- Click: lock free rotation; transition camera to one composed, fixed topic view, fracture/reveal the relevant color and orbit, then show restrained editorial typography on the left and usable project list on the right.
- While focused, cursor interacts with projects, **not sculpture rotation**. Back returns to exploration and reassembles the stone.
- Prioritize actual work/case-study readability over the spectacle.

## Five zones (subject to first model raycast test)
- **MIND / head**: gold liquid, AI and creative innovation, clickable around the head front/back.
- **SIGNAL / front-right neck**: blue fiber-optic signal, websites/digital experience. Only from front/right because the active vein is designed in that visible section; not an arbitrary global rotation-angle rule.
- **CORE / chest + back**: red pulsating energy, branding and visual identity. Front and back share the same logical destination but distinct surface treatments.
- **FORM / shoulders**: green organic growth and environmental/spatial/exhibition/landscape design, separate from generic building design.
- **FOUNDATION / base**: silver-grey ordered structural network, strategy and interdisciplinary work.
- 3D raycasting should respect front-most geometry, not click through opaque body parts.

## Source model candidates checked 2026-11-17
1. [Wikimedia Commons complete David STL](https://commons.wikimedia.org/wiki/File:David_(Michelangelo).stl): full scan (~57 MB) and stated **CC BY-SA 4.0**. Promising for silhouette and torso geometry. Check attribution and share-alike requirements before publicly distributing derivatives.
2. [Scan the World David, Google Arts & Culture](https://artsandculture.google.com/asset/david-michelangelo-scan-the-world/OQFTUx79zTp0sw?hl=en): a plaster cast in SMK digitized with permission, with an external download reference. Check the exact file and applicable asset license at download.
3. [Stanford Digital Michelangelo Project](https://www.graphics.stanford.edu/data/mich/): extremely detailed professional scan, but restrictive research-oriented noncommercial distribution terms. **Do not use as a general website download**.
4. [Head of Michelangelo's David, Optimised](https://sketchfab.com/3d-models/head-of-michelangelos-david-optimised-d29af50360624e5e9b1855666475380d): optimized head only, marked CC BY with NoAI label; lacks chest/back. Not the first choice for this torso project.

The public-domain status of the original historical sculpture is **not equivalent** to unconditional rights to use or redistribute every modern scan, photo or derivative; verify each chosen digital asset license and any applicable cultural-heritage restrictions.

## Next first working prototype
1. Download/inspect legitimate full model manually or via connected local Codex/Blender.
2. Preserve original in a distinct Blender collection and make a non-destructive working duplicate.
3. Crop/retopologize the *upper torso*, repair mesh closure; keep a separate original-like stone base. Verify visible neck, front and back.
4. Create a lightweight GLB, maintain a high-resolution Blender source; perform budget and render tests instead of assuming a target poly count.
5. Prototype rotation, real surface raycast, and **MIND only** (subtle hover gold leakage, fixed camera, gold fracture). Keep the other zones disabled placeholders until MIND is validated.
6. Add keyboard and low-motion alternatives plus direct Works navigation for recruiter usability.
7. Add project preview UX only when core 3D state transitions are stable.

Do not overwrite `index.html` or delete old RPG sources until the new David proof-of-concept has been reviewed.
