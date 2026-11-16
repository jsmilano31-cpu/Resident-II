# The Residence II - Cinematic architectural presentation

Static Next.js/React/TypeScript website using the client supplied 41 architectural perspectives and 2 floor plans. No accounts, CMS, video, or model runtime.

## Run and verify

Node 24.15+. Run npm ci, npm run dev, npm run lint, npm test, npm run build, npm run typecheck, npm run check:export. npm start serves the static out/ directory.

## Entrance

CinematicEntrance presents Exterior 1, Entry Porch 1, and Living Area 1. A 12-second inner-layer scale from 1.00 to 1.06 starts after the first image loads. The title enters over 1.25 seconds. On desktop (1100px width, 700px height, fine pointer, normal motion), a 300svh section with a sticky 100svh stage crossfades the three images using native scrolling and GSAP. No synthetic door or continuous walkthrough is claimed. Transitions hold the preceding scene until destination images decode. Skip introduction remains available. Browser resize/unmount cleanup removes animation styles.

Mobile/tablet, reduced-motion, save-data and no-JavaScript views preserve three stacked scenes. Portrait framing retains the complete exterior. Reduced motion disables CSS motion and GSAP. No loader blocks the initial image, text, navigation, or scrolling.

## Gallery and plans

A six-image editorial page has a full-width lead image and paired desktop images, stacked on mobile. The room selector filters all 41 perspectives. Pager controls return focus to the new gallery page. Native lightboxes support keyboard arrows, Escape, background scroll lock and focus restoration. The plan viewer preserves uncropped artwork, floor selection, 100-300 percent zoom and reset.

## Assets and hosting

See ASSET_CHECKLIST.md and ASSETS.md. Responsive WebP assets are static and backed by checksum manifests. No synthetic recoloring or fabricated dusk images are used. Keep Vercel framework Next.js and Output Directory at its adapter default; local export remains out/. Node 24. GitHub Resident-II main deploys to archi2-kohl.vercel.app. NEXT_PUBLIC_SITE_URL optionally overrides canonical/social URLs; indexing defaults to noindex.

## Verification limits

Tests cover image inventory, gallery filtering/paging, dialogs, zoom, reduced motion, save-data, desktop scene gating and GSAP cleanup. Browser access host was unavailable during this update, so actual desktop/mobile composition, native focus trapping, console output and scroll smoothness have not been visually verified. Test the deployed site at 1920x1080, 1440x900, 768x1024, 390x844 and 320x700 before client presentation.
