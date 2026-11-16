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
test("the explorer starts in the living room and every one of the 41 angles is selectable",()=>{
 const view=render(<ArchitecturalGallery items={images} label="All rooms"/>);
 assert.equal((view.getByRole("combobox") as HTMLSelectElement).value,"living");
 let count=0;
 for(const space of spaces){
  fireEvent.change(view.getByRole("combobox"),{target:{value:space.id}});
  const views=images.filter(image=>image.spaceId===space.id);
  for(const [index,image] of views.entries()){
   fireEvent.click(view.getByRole("button",{name:space.name+", angle "+(index+1)}));
   const displayed=view.getByRole("button",{name:"Enlarge: "+image.caption}).querySelector("img");
   assert.equal(displayed?.getAttribute("src"),image.src);count++;
  }
 }
 assert.equal(count,41);
 fireEvent.click(view.getByRole("button",{name:"Browse all 41 views"}));
 assert.equal(document.querySelectorAll("#all-perspectives figure").length,41);
});

test("desktop room buttons, category reset and angle wrapping stay synchronized",()=>{
 const view=render(<ArchitecturalGallery items={images} label="All rooms"/>);
 const balcony=spaces.find(space=>space.id==="balcony")!;
 fireEvent.click(view.getByRole("button",{name:balcony.name+" "+balcony.japanese}));
 const views=images.filter(image=>image.spaceId==="balcony");
 fireEvent.click(view.getByRole("button",{name:"Previous angle"}));
 assert.ok(view.getByRole("button",{name:"Enlarge: "+views.at(-1)!.caption}));
 fireEvent.click(view.getByRole("button",{name:"Next angle"}));
 assert.ok(view.getByRole("button",{name:"Enlarge: "+views[0].caption}));
 fireEvent.click(view.getByRole("button",{name:"Shared spaces"}));
 const selected=(view.getByRole("combobox") as HTMLSelectElement).value;
 assert.ok(images.some(image=>image.spaceId===selected&&image.category==="Shared spaces"));
 assert.equal(view.queryByRole("button",{name:balcony.name+" "+balcony.japanese}),null);
 fireEvent.click(view.getByRole("button",{name:"All spaces"}));
 const closet=spaces.find(space=>space.id==="closet")!;
 fireEvent.click(view.getByRole("button",{name:closet.name+" "+closet.japanese}));
 assert.ok((view.getByRole("button",{name:"Next angle"}) as HTMLButtonElement).disabled);
});

test("plan viewer loads originals on demand, bounds zoom, resets floors and restores focus",()=>{
 const view=render(<FloorPlans/>);const opener=view.getByRole("button",{name:"Enlarge Ground Floor plan"});assert.equal(document.querySelector('img[src$="original.png"]'),null);fireEvent.click(opener);const dialog=within(view.getByRole("dialog"));for(let i=0;i<4;i++)fireEvent.click(dialog.getByRole("button",{name:"Zoom in"}));assert.ok(dialog.getByText("300%"));assert.ok((dialog.getByRole("button",{name:"Zoom in"}) as HTMLButtonElement).disabled);fireEvent.click(dialog.getByRole("button",{name:/^Second Floor/}));assert.ok(dialog.getByText("100%"));fireEvent.click(dialog.getByRole("button",{name:"Close floor plan"}));assert.equal(document.activeElement,opener);assert.equal(document.querySelector('img[src$="original.png"]'),null);
});
test("explorer modal supports keyboard navigation, scroll lock and focus restoration",()=>{
 const view=render(<ArchitecturalGallery items={images} label="All rooms"/>);
 const image=images.find(image=>image.spaceId==="living")!;
 assert.equal(view.container.querySelector('img[src$="2560.webp"]'),null);
 const opener=view.getByRole("button",{name:"Enlarge: "+image.caption});opener.focus();fireEvent.click(opener);
 const dialog=view.getByRole("dialog");assert.equal(dialog.querySelector("img")?.getAttribute("src"),image.fullSrc);
 const index=images.indexOf(image);
 fireEvent.keyDown(dialog,{key:"ArrowLeft"});assert.equal(dialog.querySelector("img")?.getAttribute("src"),images[(index-1+images.length)%images.length].fullSrc);
 fireEvent.keyDown(dialog,{key:"ArrowRight"});assert.equal(dialog.querySelector("img")?.getAttribute("src"),image.fullSrc);
 assert.equal(document.documentElement.style.overflow,"hidden");
 fireEvent.click(view.getByRole("button",{name:"Close image"}));
 assert.equal(document.documentElement.style.overflow,"");assert.equal(document.activeElement,opener);
 assert.equal(view.container.querySelector('img[src$="2560.webp"]'),null);
});
