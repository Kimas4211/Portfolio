# BEYOND FORM. — David sculpture portfolio

Current direction: **a real 3D Michelangelo David sculpture**, not the former dragon/RPG homepage. The older prototype is retired; its legacy files remain in Git history and some non-loaded directories for reference.

## Current web prototype

`index.html` has been replaced with a Three.js-based prototype. It loads a real licensed STL mesh (not a procedurally invented bust), renders only the scanned upper torso using a clipping plane, provides pointer-led rotation and basic surface picking, and displays a dedicated editorial Focus layout. It intentionally does **not yet implement** true stone fracture, volumetric liquid-gold spill, or complete case-study pages. Those are next-stage tasks, not finished features.

Model selection: [David (Michelangelo).stl on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:David_(Michelangelo).stl), scanned by Scan the World, **CC BY-SA 4.0**. License applies to adaptations; credit the creator, link license and mark adaptations. File is 57.22 MB, too large for a production homepage. Confirm rights/attribution and optimize before publication. The original statue is historical, but scans can have distinct rights.

The prototype looks for `assets/models/david.stl` first and falls back to the Wikimedia hosted STL (which can fail because of network/CORS rules). Until the source asset is available, the page displays a visible model-load instruction rather than misrepresenting another statue as David.

## Run and inspect locally

In Codex Desktop, open the repository directory. Download `David (Michelangelo).stl` from the above Commons page and save it as `assets/models/david.stl`. For browser loading, serve from a local HTTP server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`. Opening `index.html` with `file://` is not suitable for module loading.

The browser will download the full 57 MB STL if you use this source. Performance may be poor; converting the scan into a **decimated, cropped, sealed, correctly oriented GLB** in Blender should be the next priority. Do not embed that entire STL in the public production site.

## Interaction intended

- **EXPLORE:** white/grey stone, no permanent color or orbit; pointer leads smooth movement.
- **DISCOVER:** visible mesh surface raycast selects a zone; tiny hover/energy marker previews the theme. Zones are spatial approximations until the mesh is segmented/painted in Blender.
- **FOCUS:** click a visible region to freeze camera rotation, bring the model to a composed view, show left typography and right project selectors with theme color and thin orbital rings.
- **RETURN:** back to free exploration.
- Five areas: gold MIND (head), blue SIGNAL (right/front neck), red CORE (chest/back), green FORM (shoulders), grey FOUNDATION (base).

The original SVG RPG assets and Mage documentation are historical experiments and are no longer the current direction.

## Remaining work

1. Obtain and inspect the licensed scan locally; identify its actual vertical orientation and silhouette, and make a torso-only version in Blender.
2. Optimize and export a compact GLB, then use `GLTFLoader` instead of the 57 MB STL loader.
3. Segment or mask actual head/front-right neck/chest/back/shoulder surfaces for precise picking and controlled hover cracks.
4. Produce the actual fracture fragments, molten gold and theme effects and authored focus-camera poses.
5. Integrate **real** project images and explanations; placeholder project names are not claims of finished work.
6. Accessibility, performance, reduced-motion, mobile and browser tests.