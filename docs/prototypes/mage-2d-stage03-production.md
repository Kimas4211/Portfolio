# Stage 03 — Mage 2.5D art production and motion specification

Status: **implementation plan**, not a claim that final illustrated cutouts or animated assets have been produced.

## Confirmed design constraints
- Preserve existing dragon scene, the five-hero composition, established Mage 01 silver-haired dark-blue robe design, and the four untouched professions.
- 3D scene may use Blender; hero artwork can be 2D/2.5D.
- Priority: authentic projects and readable case studies > cinematic transition > character detail.
- Preserve the clickable button and ability/archive behavior in `index.html`.
- `assets/characters/mage-2d-prototype.svg` remains a disposable prototype, **not final artwork**.
- A composition study (three character states together) is **not** a replacement for independent transparent animation assets.

## Art export contract
All layers must derive from the **same approved mage design and identical base registration**.

Canvas: 1024 × 1536 transparent pixel artboard per frame, 1:1 registration.
- Mage body height / floor line identical for all poses at rest; do not shift the foot anchor.
- Alpha channel mandatory (RGBA PNG or WebP).
- Provide safe padding for the long staff and mantle tips.
- Avoid baked-in scene background, ground shadow, strong glows or UI text.
- Premultiplied/straight alpha handling must be checked in browser (prevent dark halos).
- Avoid overly tiny embroidered details that vanish at homepage size.

Suggested deliverables:
```
assets/characters/mage/
  mage_idle_color.webp
  mage_idle_silhouette.webp
  mage_head.webp
  mage_hair_front.webp
  mage_mantle_back.webp
  mage_arm_cast.webp
  mage_staff.webp
  mage_cast.webp
  mage_glow_mask.webp
```
This list describes **planned file paths**, not files presently in the repository.

## Interaction sequence
**Idle:** silhouette rendered at the existing party anchor; no spontaneous large movement.  
**Hover / focus (0.35–0.55 s):** crossfade to full color from precisely matching coordinates, slight blue staff-core pulse, mantle/head limited motion. Never shift the character by swapping unrelated artwork.  
**Click / cast (approx. 1–1.6 s):** raise casting arm and reveal controlled arcane blue beam; transition to Mage grimoire archive. Avoid forced full-screen flashes.  
**Return:** if no cast, reverse the hover state. Pointer leaving mid-hover must not leave a stuck glow.  
**Reduced motion:** immediate state change and direct entry to archive.

## Technical integration priorities
1. Approve one clean, transparent, full-body PNG/WebP, comparing to the originally approved concept sheet.
2. Produce silhouette from **exactly the same alpha source**, not from a separately re-drawn silhouette.
3. Replace source path in Mage-only billboard with minimal code change.
4. Then split the same master artwork into one or two moving layers: mantle, hair/staff.
5. For parallax, test fixed-screen billboard against a simple anchored plane with depth; avoid unnatural disconnected limbs.
6. Implement cast state with preloaded sprite layers (or a small sprite sheet), then return to existing archive opening.
7. Verify mobile, keyboard activation, no-FX paths, load size and render performance.

## Acceptance checklist
- From homepage scale, mage staff/head/cape silhouette distinguishes Mage from Warlock.
- Default silhouette and hover art align perfectly and preserve original party composition.
- Idle does not obstruct neighboring hero hit boxes.
- The 3D environment lighting remains predominantly volcanic red/orange, with restrained blue magic.
- Click reliably opens the archive, and `Quick View` still works.
- Existing Warrior, Ranger, Healer and Warlock visuals/interactions unchanged.
- No unreviewed final art, fabricated project results, or real 3D export claims.

## Current state
The earlier Stage 02 SVG crossfade is functional and remains the version available on GitHub Pages. This document specifies the next production pass. Any image showing all three states as a composite is only a concept visualization; a production sprite set still needs to be created and verified.
