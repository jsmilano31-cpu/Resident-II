import sharp from "sharp";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

const source = process.argv[2];
if (!source)
  throw new Error("Usage: node scripts/import-renders.mjs <source-folder>");
const groups = [
  [
    "MAIN EXTERIOR PERSPECTIVES",
    "exterior",
    "Exterior perspectives",
    "外観",
    "Arrival",
  ],
  ["ENTRY PORCH", "entry", "Entry porch", "玄関ポーチ", "Arrival"],
  ["CARPORT", "garage", "Covered garage", "ガレージ", "Arrival"],
  ["RAMP", "ramp", "Entrance ramp", "玄関スロープ", "Arrival"],
  ["LIVING", "living", "Living room", "リビング", "Shared spaces"],
  ["DINING", "dining", "Dining room", "ダイニング", "Shared spaces"],
  ["KITCHEN", "kitchen", "Kitchen", "キッチン", "Shared spaces"],
  ["BAR", "bar", "Bar lounge", "バーラウンジ", "Shared spaces"],
  ["STAIRS", "stairs", "Staircase", "階段", "Circulation"],
  [
    "SECOND FLOOR HALLWAY",
    "hallway",
    "Second-floor hallway",
    "2階ホール",
    "Circulation",
  ],
  [
    "MASTER'S BEDROOM TOILET",
    "primary-bath",
    "Primary bathroom",
    "主寝室のバスルーム",
    "Bathrooms & utility",
  ],
  [
    "MASTER'S BEDROOM VIEW",
    "primary",
    "Primary bedroom",
    "主寝室",
    "Private spaces",
  ],
  ["BEDROOM 1", "bedroom-1", "Bedroom 1", "寝室 1", "Private spaces"],
  ["BEDROOM 2", "bedroom-2", "Bedroom 2", "寝室 2", "Private spaces"],
  ["BEDROOM 3", "bedroom-3", "Bedroom 3", "寝室 3", "Private spaces"],
  ["BEDROOM 4", "bedroom-4", "Bedroom 4", "寝室 4", "Private spaces"],
  [
    "MASTER'S BEDROOM WALKING",
    "closet",
    "Walk-in closet",
    "ウォークインクローゼット",
    "Private spaces",
  ],
  [
    "SECOND FLOOR TOILET",
    "upper-bath",
    "Second-floor bathroom",
    "2階バスルーム",
    "Bathrooms & utility",
  ],
  [
    "COMMON TOILET",
    "common-bath",
    "Common bathroom",
    "共用バスルーム",
    "Bathrooms & utility",
  ],
  [
    "DIRTY KITCHEN",
    "secondary-kitchen",
    "Secondary kitchen",
    "セカンドキッチン",
    "Bathrooms & utility",
  ],
  ["LAUNDRY", "laundry", "Laundry", "ランドリー", "Bathrooms & utility"],
  ["BALCONY", "balcony", "Balcony", "バルコニー", "Outdoor & details"],
  [
    "DESIGN AESTHETICS",
    "facade-detail",
    "Facade detail",
    "外観のディテール",
    "Outdoor & details",
  ],
];
const files = (await readdir(source))
  .filter((name) => /\.png$/i.test(name) && !name.startsWith("GROUND FLOOR") && name !== "SECOND FLOOR.png")
  .sort();
if (files.length !== 41)
  throw new Error(`Expected 41 supplied renders; found ${files.length}`);
const output = resolve("public/residence");
await mkdir(output, { recursive: true });
const images = [];
for (const filename of files) {
  const group = groups.find(([prefix]) => filename.replace("BALOCNY", "BALCONY").startsWith(prefix));
  if (!group) throw new Error(`Unmapped source: ${filename}`);
  const [, spaceId, spaceName, japanese, category] = group;
  const id = filename
    .replace(/\.png$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "");
  const input = await readFile(join(source, filename));
  const meta = await sharp(input).metadata();
  for (const width of [640, 1280, 1920, 2560]) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 640 ? 77 : 83, effort: 4 })
      .toFile(join(output, `${id}-${width}.webp`));
  }
  const index = images.filter((image) => image.spaceId === spaceId).length + 1;
  images.push({
    id,
    sourceFilename: filename,
    sourceSha256: createHash("sha256").update(input).digest("hex"),
    width: meta.width,
    height: meta.height,
    spaceId,
    spaceName,
    japanese,
    category,
    view: index,
    caption: `${spaceName} — View ${String(index).padStart(2, "0")}`,
    alt: `${spaceName}, supplied architectural render, perspective ${index}.`,
    src: `/residence/${id}-1280.webp`,
    fullSrc: `/residence/${id}-2560.webp`,
    sources: [640, 1280, 1920].map((width) => ({
      width,
      src: `/residence/${id}-${width}.webp`,
    })),
  });
  console.log(`${images.length}/${files.length} ${filename}`);
}
await writeFile(
  "src/data/renders.json",
  JSON.stringify(images, null, 2) + "\n",
);
await writeFile(
  join(output, "manifest.json"),
  JSON.stringify(images, null, 2) + "\n",
);
console.log(
  "All 41 originals mapped to responsive assets. Source files are unchanged.",
);
