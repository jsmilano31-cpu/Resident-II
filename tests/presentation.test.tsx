import "./setup-dom";
import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { render, fireEvent, cleanup, within } from "@testing-library/react";
import { images, spaces, showcaseGroups } from "../src/data/project";
import { FloorPlans, floorPlans } from "../src/components/FloorPlans";
import { ArchitecturalGallery } from "../src/components/ArchitecturalGallery";
afterEach(cleanup);

test("the presentation collections include every supplied view exactly once and lead with the house", () => {
 const presented = Object.values(showcaseGroups).flat();
 assert.equal(presented.length, 41);
 assert.deepEqual(new Set(presented.map(image => image.id)), new Set(images.map(image => image.id)));
 assert.ok(showcaseGroups.exterior[0].sourceFilename.startsWith("MAIN EXTERIOR"));
 assert.equal(showcaseGroups.shared[0].spaceId, "living");
});
test("all 41 perspectives and 2 plans have valid manifests and decodable responsive assets", async () => {
 assert.equal(images.length,41); assert.equal(floorPlans.length,2);
 assert.equal(new Set(images.map(i=>i.sourceSha256)).size,41);
 assert.deepEqual(JSON.parse(await readFile("public/residence/manifest.json","utf8")),images);
 for(const image of [...images,...floorPlans]) {
  for(const source of image.sources) { const metadata=await sharp("public"+source.src).metadata(); assert.equal(metadata.width,source.width); assert.ok(Math.abs(metadata.height! / metadata.width! - image.height/image.width)<.002); }
  await sharp("public"+image.fullSrc).metadata();
 }
 for(const plan of floorPlans) {
  assert.equal(createHash("sha256").update(await readFile("public"+plan.fullSrc)).digest("hex"),plan.sourceSha256);
  for(const id of plan.roomIds) assert.ok(spaces.some(s=>s.id===id));
 }
});
test("gallery pages expose all 41 perspectives in groups of six and wrap",()=>{
 const view=render(<ArchitecturalGallery items={images} label="All rooms"/>); const seen=new Set<string>();
 for(let page=0;page<Math.ceil(images.length/6);page++){
  const cards=view.getAllByRole("button",{name:/^Enlarge:/});assert.ok(cards.length<=6);
  cards.forEach(card=>seen.add(card.getAttribute("aria-label")!));
  fireEvent.click(view.getByRole("button",{name:"Next All rooms views"}));
 }
 assert.equal(seen.size,41);assert.ok(view.getByRole("button",{name:"Enlarge: "+images[0].caption}));
 fireEvent.click(view.getByRole("button",{name:"Previous All rooms views"}));assert.equal(view.getAllByRole("button",{name:/^Enlarge:/}).length,5);
});

test("plan viewer loads originals on demand, bounds zoom, resets floors and restores focus",()=>{
 const view=render(<FloorPlans/>);const opener=view.getByRole("button",{name:"Enlarge Ground Floor plan"});assert.equal(document.querySelector('img[src$="original.png"]'),null);fireEvent.click(opener);const dialog=within(view.getByRole("dialog"));for(let i=0;i<4;i++)fireEvent.click(dialog.getByRole("button",{name:"Zoom in"}));assert.ok(dialog.getByText("300%"));assert.ok((dialog.getByRole("button",{name:"Zoom in"}) as HTMLButtonElement).disabled);fireEvent.click(dialog.getByRole("button",{name:/^Second Floor/}));assert.ok(dialog.getByText("100%"));fireEvent.click(dialog.getByRole("button",{name:"Close floor plan"}));assert.equal(document.activeElement,opener);assert.equal(document.querySelector('img[src$="original.png"]'),null);
});
test("gallery modal supports click, keyboard navigation and focus restoration",()=>{
 const view=render(<ArchitecturalGallery items={images} label="All rooms"/>);
 assert.equal(view.container.querySelector('img[src$="2560.webp"]'),null);
 const opener=view.getByRole("button",{name:"Enlarge: "+images[0].caption});opener.focus();fireEvent.click(opener);
 const dialog=view.getByRole("dialog");assert.equal(dialog.querySelector("img")?.getAttribute("src"),images[0].fullSrc);
 fireEvent.keyDown(dialog,{key:"ArrowLeft"});assert.equal(dialog.querySelector("img")?.getAttribute("src"),images.at(-1)!.fullSrc);
 fireEvent.keyDown(dialog,{key:"ArrowRight"});assert.equal(dialog.querySelector("img")?.getAttribute("src"),images[0].fullSrc);
 assert.equal(document.documentElement.style.overflow,"hidden");
 fireEvent.click(view.getByRole("button",{name:"Close image"}));
 assert.equal(document.documentElement.style.overflow,"");assert.equal(document.activeElement,opener);
 assert.equal(view.container.querySelector('img[src$="2560.webp"]'),null);
});

test("room filtering resets pagination and exposes all matching perspectives",()=>{
 const view=render(<ArchitecturalGallery items={images} label="All rooms"/>);
 fireEvent.click(view.getByRole("button",{name:"Next All rooms views"}));
 for(const space of spaces){fireEvent.change(view.getByRole("combobox"),{target:{value:space.id}});const roomImages=images.filter(i=>i.spaceId===space.id);assert.equal(view.getAllByRole("button",{name:/^Enlarge:/}).length,roomImages.length);for(const image of roomImages)assert.ok(view.getByRole("button",{name:"Enlarge: "+image.caption}));}
});
