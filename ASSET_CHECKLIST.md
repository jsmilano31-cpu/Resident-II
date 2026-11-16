# Asset checklist

All required assets are already present. Keep originals in the supplied japan 2 renders/japan 2 renders folder; the import scripts regenerate public assets and manifests.

- Opening: MAIN EXTERIOR PERSPECTIVES 1.png, ENTRY PORCH VIEW 1.png, LIVING AREA VIEW 1.png. Ordering and focal positions are in src/data/project.ts.
- Gallery: 41 supplied perspectives, listed in src/data/renders.json and public/residence/manifest.json. Static WebP sizes 640/1280/1920/2560; source filenames and checksums retained.
- Plans: GROUND FLOOR.png and SECOND FLOOR.png, listed in src/data/floorplans.json. Originals remain 1600x1200. Preview sizes 640/1280/1600. Enlarged viewer loads original PNG only when opened.
- Technical passes: three ground-floor rendering passes remain documented as source references, outside the client gallery.
- Film and model: none supplied or required. Future MP4/WebM or GLB/GLTF media needs a separate integration; no placeholder viewer is published.

To regenerate, run node scripts/import-renders.mjs <source-folder> then node scripts/import-floorplans.mjs <source-folder>. Both commands preserve original files. Source spelling changes only in interface labels. Do not invent rooms, dimensions, location, credits or contact information.
