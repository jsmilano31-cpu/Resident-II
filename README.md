# The Residence II ? Light & Layers

Independent architectural presentation: 41 perspectives, 2 plans, English with Japanese labels. Static Next.js, React, TypeScript and GSAP. No login or backend.

Use Node 24.15+. Run npm ci, npm run dev, npm run lint, npm test, npm run build, npm run typecheck, npm run check:export. npm start previews out/.

Six chapters: opening, facade details, shared living, floor/room explorer, complete collection, closing exterior. Plan links show room perspectives alongside plans. Dialogs provide zoom and full-resolution viewing. Reduced motion and data saving bypass animation. Unsupported scroll-progress browsers retain the static navigation.

Rebuild assets using scripts/import-renders.mjs and scripts/import-floorplans.mjs, passing the supplied japan 2 renders/japan 2 renders directory. Manifests record original filenames, checksums, dimensions and room associations. Perspectives: 640/1280/1920/2560px WebP. Plans: 640/1280/1600px previews and original PNGs. Technical render passes remain source references outside the public gallery. The darker closet view remains available. Laundry has a plan label but no standalone perspective.

Deploy independently to the archi2 Vercel project connected to GitHub. Node 24, Next.js, npm run build; leave Vercel Output Directory at the Next.js default. Local static export is out/. NEXT_PUBLIC_SITE_URL sets canonical and social URLs. Default robots is noindex; enable indexing intentionally with NEXT_PUBLIC_ALLOW_INDEXING=true.

GitHub CI runs lint, tests, build, types and export checks. Native browser focus trapping, visual appearance and physical-device performance require browser QA; report unavailable checks explicitly.
