import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
const html=await readFile("out/index.html","utf8");const doc=new JSDOM(html).window.document;
for(const id of ["hero","concept","layers","layout","collection","finale"])assert.ok(doc.querySelector("main > section#"+id));
assert.equal(doc.querySelectorAll("h1").length,1);
assert.ok(doc.querySelector('img[fetchpriority="high"]'));
assert.ok(html.includes("The Residence II"));
for(const a of doc.querySelectorAll('a[href^="#"]'))assert.ok(doc.getElementById(a.getAttribute("href").slice(1)));
for(const node of doc.querySelectorAll("img[src],script[src],link[href]")){const url=node.getAttribute("src")??node.getAttribute("href");if(url?.startsWith("/")&&!url.startsWith("//"))await access(resolve("out","."+url.split("?")[0]));}
const images=JSON.parse(await readFile("out/residence/manifest.json","utf8"));const plans=JSON.parse(await readFile("out/floorplans/manifest.json","utf8"));assert.equal(images.length,41);assert.equal(plans.length,2);
for(const image of [...images,...plans])for(const path of [image.src,image.fullSrc,...image.sources.map(s=>s.src)])await access(resolve("out","."+path));
assert.equal(doc.querySelector('meta[name="robots"]').content.includes("noindex"),process.env.NEXT_PUBLIC_ALLOW_INDEXING!=="true");
await access("out/404.html");console.log("Verified cinematic opening and 5 chapters, all 41 perspectives and both plans, responsive assets, anchors, metadata and static output.");

assert.equal(doc.querySelectorAll(".entrance-scene").length,3);
assert.equal(doc.querySelectorAll(".space-explorer .explorer-image").length,1);
assert.ok(doc.querySelector('.space-explorer .explorer-image img[src*="living-area-view-1"]'));
assert.equal(doc.querySelectorAll(".space-explorer .gallery-filters button").length,7);
assert.equal(doc.querySelectorAll(".space-explorer .space-list button").length,22);
assert.ok(doc.querySelector('a.skip-intro[href="#concept"]'));
assert.equal(doc.querySelectorAll('img[fetchpriority="high"]').length,1);
assert.equal(doc.querySelector('video,canvas'),null);
