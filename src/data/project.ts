import renders from "./renders.json";
import type { ArchitecturalImage } from "@/types/architecture";
export const images: ArchitecturalImage[] = renders;
export const categories = [
  "All spaces",
  "Arrival",
  "Shared spaces",
  "Private spaces",
  "Circulation",
  "Bathrooms & utility",
  "Outdoor & details",
];
const spaceOrder = [
  "exterior",
  "entry",
  "ramp",
  "garage",
  "living",
  "dining",
  "kitchen",
  "bar",
  "stairs",
  "hallway",
  "primary",
  "primary-bath",
  "closet",
  "bedroom-1",
  "bedroom-2",
  "bedroom-3",
  "bedroom-4",
  "upper-bath",
  "common-bath",
  "secondary-kitchen",
  "laundry",
  "balcony",
  "facade-detail",
];
export const spaces = [
  ...new Map(
    images.map((i) => [
      i.spaceId,
      {
        id: i.spaceId,
        name: i.spaceName,
        japanese: i.japanese,
        category: i.category,
      },
    ]),
  ).values(),
].sort((a, b) => spaceOrder.indexOf(a.id) - spaceOrder.indexOf(b.id));
export function renderByFile(name: string) {
  const image = images.find((i) => i.sourceFilename === name);
  if (!image) throw new Error("Missing supplied render: " + name);
  return image;
}
export const project = {
  name: "The Residence II",
  hero: renderByFile("MAIN EXTERIOR PERSPECTIVES 2.png"),
  living: renderByFile("LIVING AREA VIEW 2.png"),
  bedroom: renderByFile("MASTER'S BEDROOM VIEW 2.png"),
  balcony: renderByFile("BALOCNY VIEW 2.png"),
};

function orderedCollection(categories: string[], leadingFiles: string[]) {
  const leading = leadingFiles.map(renderByFile);
  const ids = new Set(leading.map(image => image.id));
  return [...leading, ...images.filter(image => categories.includes(image.category) && !ids.has(image.id))];
}
export const showcaseGroups = {
  exterior: orderedCollection(["Arrival", "Outdoor & details"], [
    "MAIN EXTERIOR PERSPECTIVES 1.png", "MAIN EXTERIOR PERSPECTIVES 2.png", "ENTRY PORCH VIEW 1.png",
  ]),
  shared: orderedCollection(["Shared spaces"], [
    "LIVING AREA VIEW 1.png", "DINING AREA VIEW 1.png", "KITCHEN AREA VIEW 1.png",
  ]),
  privateRooms: orderedCollection(["Private spaces"], [
    "MASTER'S BEDROOM VIEW 2.png", "BEDROOM 2 VIEW 1.png", "BEDROOM 3 VIEW 1.png",
  ]),
  details: orderedCollection(["Circulation", "Bathrooms & utility"], [
    "STAIRS AREA VIEW 1.png", "MASTER'S BEDROOM TOILET AND BATH VIEW 1.png", "SECOND FLOOR TOILET AND BATH VIEW 1.png",
  ]),
};
