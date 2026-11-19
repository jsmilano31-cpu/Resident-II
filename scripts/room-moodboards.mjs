import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const renders = await readJson("src/data/renders.json");
const boards = await readJson("src/data/room-moodboards.json");
const rendersById = new Map(renders.map((image) => [image.id, image]));
const verify = process.argv.includes("--check");
const assetRoot = process.argv.includes("--export") ? "out" : "public";

assert.deepEqual(
  Object.keys(boards).sort(),
  [...new Set(renders.map((image) => image.spaceId))].sort(),
  "Every gallery space needs a mood board",
);

let count = 0;
for (const [space, board] of Object.entries(boards)) {
  assert.equal(rendersById.get(board.main)?.spaceId, space);
  assert.ok(board.details.length >= 2 && board.details.length <= 4, space);
  const directory = assetRoot + "/room-moodboards/" + space;
  if (!verify) await mkdir(directory, { recursive: true });

  for (const [index, detail] of board.details.entries()) {
    const source = rendersById.get(detail.source);
    assert.equal(source?.spaceId, space, detail.source);
    assert.ok(detail.label.trim() && detail.ja.trim());
    const { left, top, width, height } = detail.crop;
    assert.ok(Number.isInteger(left) && left >= 0 && left + width <= source.width);
    assert.ok(Number.isInteger(top) && top >= 0 && top + height <= source.height);
    assert.ok(Number.isInteger(width) && width >= 320);
    assert.ok(Number.isInteger(height) && height > 0);

    const stem = directory + "/" + (index + 1);
    const original = sharp("public" + source.fullSrc).extract(detail.crop);
    for (const variant of ["full", "320"]) {
      const pixels = original.clone();
      if (variant === "320") pixels.resize({ width: 320 });
      const file = stem + "-" + variant + ".webp";
      if (verify) {
        const expected = await pixels.raw().toBuffer({ resolveWithObject: true });
        const actual = await sharp(file).raw().toBuffer({ resolveWithObject: true });
        assert.equal(actual.info.width, expected.info.width, file);
        assert.equal(actual.info.height, expected.info.height, file);
        assert.ok(actual.data.equals(expected.data), file);
      } else {
        await pixels.webp({ lossless: true }).toFile(file);
      }
    }
    count++;
  }
}
console.log((verify ? "Verified " : "Generated ") + count + " source crops for " + Object.keys(boards).length + " boards.");
