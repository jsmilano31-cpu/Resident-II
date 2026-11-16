import "./setup-dom";
import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { render, fireEvent, cleanup, within } from "@testing-library/react";
import { images, spaces } from "../src/data/project";
import { FloorPlans, floorPlans } from "../src/components/FloorPlans";
import { Gallery } from "../src/components/Gallery";
afterEach(cleanup);
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
test("all perspectives are selectable through room and angle controls",()=>{
 const view=render(<Gallery items={images}/>); let count=0;
 for(const space of spaces){ fireEvent.change(view.getByRole("combobox"),{target:{value:space.id}}); const views=images.filter(i=>i.spaceId===space.id); for(const [index,image] of views.entries()){fireEvent.click(view.getByRole("button",{name:space.name+", angle "+(index+1)}));assert.ok(view.getByRole("button",{name:"Enlarge: "+image.caption}));count++;}}
 assert.equal(count,41);fireEvent.click(view.getByRole("button",{name:"Browse all 41 views"}));assert.equal(document.querySelectorAll("#all-perspectives figure").length,41);
});
test("every floor room opens the matching first perspective beside its plan",()=>{
 const view=render(<FloorPlans/>);
 for(const plan of floorPlans){fireEvent.click(view.getByRole("button",{name:plan.title+" "+plan.japanese}));const list=within(view.getByRole("complementary",{name:plan.title+" rooms"}));for(const id of plan.roomIds){const space=spaces.find(s=>s.id===id)!;fireEvent.click(list.getByRole("link",{name:space.name+" "+space.japanese}));const first=images.find(i=>i.spaceId===id)!;assert.ok(view.getByRole("button",{name:"Enlarge: "+first.caption}));}}
});
test("plan viewer loads originals on demand, bounds zoom, resets floors and restores focus",()=>{
 const view=render(<FloorPlans/>);const opener=view.getByRole("button",{name:"Enlarge Ground Floor plan"});assert.equal(document.querySelector('img[src$="original.png"]'),null);fireEvent.click(opener);const dialog=within(view.getByRole("dialog"));for(let i=0;i<4;i++)fireEvent.click(dialog.getByRole("button",{name:"Zoom in"}));assert.ok(dialog.getByText("300%"));assert.ok((dialog.getByRole("button",{name:"Zoom in"}) as HTMLButtonElement).disabled);fireEvent.click(dialog.getByRole("button",{name:/^Second Floor/}));assert.ok(dialog.getByText("100%"));fireEvent.click(dialog.getByRole("button",{name:"Close floor plan"}));assert.equal(document.activeElement,opener);assert.equal(document.querySelector('img[src$="original.png"]'),null);
});
test("gallery modal navigates and restores focus",()=>{
 const view=render(<Gallery items={images}/>);const opener=view.getByRole("button",{name:"Enlarge: "+images.find(i=>i.spaceId==="living")!.caption});fireEvent.click(opener);const dialog=view.getByRole("dialog");assert.ok(dialog.querySelector('img[src$="2560.webp"]'));fireEvent.keyDown(dialog,{key:"ArrowRight"});fireEvent.click(view.getByRole("button",{name:"Close gallery"}));assert.equal(document.activeElement,opener);
});
