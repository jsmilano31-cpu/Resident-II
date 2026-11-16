export type ArchitecturalImage = {
  id: string;
  sourceFilename: string;
  sourceSha256: string;
  src: string;
  fullSrc: string;
  sources: { width: number; src: string }[];
  width: number;
  height: number;
  spaceId: string;
  spaceName: string;
  japanese: string;
  category: string;
  view: number;
  alt: string;
  caption: string;
};

export type PresentationImage = Pick<ArchitecturalImage, "src" | "fullSrc" | "sources" | "width" | "height" | "alt">;
export type FloorPlan = PresentationImage & {
  id: string;
  sourceFilename: string;
  sourceSha256: string;
  title: string;
  japanese: string;
  roomIds: string[];
};
