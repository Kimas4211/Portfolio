# Codex Desktop + Blender MCP — David model conversion task

Read `README.md` and the approved creative design in `docs/prototypes/david-sculpture-direction.md`.

1. In your local Portfolio clone, obtain the model from https://commons.wikimedia.org/wiki/File:David_(Michelangelo).stl with license verification. Do not claim a download until saved to `assets/models/david.stl`.
2. Through Blender MCP, **import the authentic STL file** into a new collection `DAVID_SCAN_ORIGINAL`. Do not modify the imported master. Report model dimensions, polygon count, orientation, and whether the file matches the intended Michelangelo figure. Show a screenshot before cropping.
3. Duplicate into `DAVID_WEB_BUST`, orient vertically with the head up, crop the lower body at upper torso (retain full back and shoulders), cap the cut and add a simple sculptural base. Preserve readable anatomy/face.
4. Produce a reasonable decimated version in a separate mesh. Target a small `.glb` with no more detail loss than is visible in normal website scale. Inspect before setting an exact triangle budget.
5. Assign grey-white stone PBR, rough surface, realistic shading. NO gold, no technology, no fantasy details in the default state.
6. Export a compressed/optimized `assets/models/david_bust.glb` and save the Blender working file separately (e.g. `assets/blender/david_bust.blend`). Do not replace originals.
7. Capture front, right, left and back previews and check surface visibility for five interaction zones. The SIGNAL neck hotspot will be limited to the front/right region.
8. Update `index.html` to prefer loading the lightweight GLB via `GLTFLoader`. Keep the verified source attribution and CC BY-SA license metadata visible; document any derivative modifications.
9. Test the web preview at a local HTTP address; check loading, rotation, precise hover, focus movement and other UI.
10. **Do not call this done if no actual David scan has been imported and rendered.** Report the precise missing file or error.

No network service listening on localhost should be exposed publicly. Preserve copies of the scan and any licensed derivative separately.