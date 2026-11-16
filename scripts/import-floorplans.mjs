import sharp from "sharp";
import { readFile, mkdir, writeFile, copyFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/import-floorplans.mjs <source-folder>");
const destination = resolve("public/floorplans");
await mkdir(destination, { recursive: true });
const plans = [];
for (const [id, sourceFilename, title, japanese, roomIds] of [
  ["ground", "GROUND FLOOR.png", "Ground Floor", "1階", ["entry", "ramp", "garage", "living", "dining", "kitchen", "secondary-kitchen", "primary", "primary-bath", "closet", "bedroom-1", "common-bath", "stairs"]],
  ["second", "SECOND FLOOR.png", "Second Floor", "2階", ["bedroom-2", "bedroom-3", "bedroom-4", "bar", "hallway", "upper-bath", "stairs", "balcony"]],
]) {
  const original = join(source, sourceFilename);
  const bytes = await readFile(original);
  const { width, height } = await sharp(bytes).metadata();
  const sources = [];
  for (const size of [640, 1280, 1600]) {
    const filename = `${id}-${size}.webp`;
    await sharp(bytes).resize({ width: size }).webp({ quality: 90 }).toFile(join(destination, filename));
    sources.push({ width: size, src: `/floorplans/${filename}` });
  }
  await copyFile(original, join(destination, `${id}-original.png`));
  plans.push({ id, sourceFilename, sourceSha256: createHash("sha256").update(bytes).digest("hex"), title, japanese, roomIds, width, height, src: sources[1].src, fullSrc: `/floorplans/${id}-original.png`, sources, alt: `${title} — supplied furnished layout of the residence` });
}
const manifest = JSON.stringify(plans, null, 2) + "\n";
await writeFile("src/data/floorplans.json", manifest);
await writeFile(join(destination, "manifest.json"), manifest);
console.log("Imported both supplied floor plans with responsive previews and unchanged originals.");
