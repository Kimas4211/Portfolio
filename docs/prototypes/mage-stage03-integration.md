# Mage 01 — Stage 03 integration status

The user approved the standalone sprite test.

**Prepared:** idle/hover/cast WebP test source files, Mage-only CSS and JS, and an installation script included in the downloadable integration package.

**GitHub status:** only text integration sources were committed at this step; the binary WebP images and homepage edits are **not** yet published. This avoids broken references on the live Portfolio page.

**To install:** download Mage01_Stage03_Integration.zip from the ChatGPT conversation and extract it at the root of a local Portfolio clone. Run `python tools/install_stage03.py` or ask Codex desktop to run it, preview, then commit and push.

**Scope:** Keep the background, other four roles, Quick View and archive system unchanged. The new idle color and dark silhouette derive from the exact same image, preserving shape. The cast pose is shown briefly on click.

**Known limitation:** generated source is a composite sheet, cropped and converted into WebP, with possible diffuse glow edges. It is not yet a segmented, animated puppet rig.
