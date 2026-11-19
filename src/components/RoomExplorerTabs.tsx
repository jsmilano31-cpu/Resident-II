import { useId, useRef, useState, type ReactNode } from "react";
import { Expand } from "lucide-react";
import { images } from "@/data/project";
import boardData from "@/data/room-moodboards.json";
import type { ArchitecturalImage, PresentationImage } from "@/types/architecture";
import { MediaImage } from "./MediaImage";

type RoomBoard = {
  main: string;
  details: {
    source: string;
    crop: { left: number; top: number; width: number; height: number };
    label: string;
    ja: string;
  }[];
};

const boards: Record<string, RoomBoard> = boardData;
const rendersById = new Map(images.map((image) => [image.id, image]));
const tabs = [
  { id: "perspectives", label: "Perspectives" },
  { id: "mood-board", label: "Mood board" },
] as const;

export type BoardImage = PresentationImage & { id: string; caption: string };
type OpenBoardImage = (image: BoardImage, button: HTMLButtonElement) => void;

function BoardFigure({
  image,
  japanese,
  sizes,
  onOpen,
}: {
  image: BoardImage;
  japanese: string;
  sizes: string;
  onOpen: OpenBoardImage;
}) {
  return (
    <figure>
      <div className="room-board-media">
        <MediaImage image={image} sizes={sizes} />
        <button
          type="button"
          className="room-board-enlarge"
          aria-label={"Enlarge: " + image.caption}
          onClick={(event) => onOpen(image, event.currentTarget)}
        >
          <Expand size={16} aria-hidden="true" />
        </button>
      </div>
      <figcaption>
        {image.caption}
        <small lang="ja">{japanese}</small>
      </figcaption>
    </figure>
  );
}

function RoomBoardView({ room, board, onOpen }: {
  room: ArchitecturalImage;
  board: RoomBoard;
  onOpen: OpenBoardImage;
}) {
  const main = rendersById.get(board.main) ?? room;
  return (
    <div className="room-board" aria-label={room.spaceName + " mood board"}>
      <BoardFigure
        image={{ ...main, caption: room.spaceName }}
        japanese={room.japanese}
        sizes="(max-width: 767px) 90vw, (max-width: 1050px) 65vw, 46vw"
        onOpen={onOpen}
      />
      <div className="room-board-details">
        {board.details.map(({ crop, label, ja }, index) => {
          const stem = "/room-moodboards/" + room.spaceId + "/" + (index + 1);
          const src = stem + "-320.webp";
          const fullSrc = stem + "-full.webp";
          return (
            <BoardFigure
              key={stem}
              image={{
                id: stem,
                src,
                fullSrc,
                width: crop.width,
                height: crop.height,
                alt: label,
                caption: label,
                sources: [{ src, width: 320 }, { src: fullSrc, width: crop.width }],
              }}
              japanese={ja}
              sizes="(max-width: 1050px) 44vw, 20vw"
              onOpen={onOpen}
            />
          );
        })}
      </div>
      <p className="room-board-note">
        Details from the architectural renders
        <span lang="ja">建築パースから抜粋したディテール</span>
      </p>
    </div>
  );
}

export function RoomExplorerTabs({ active, onOpen, children }: {
  active: ArchitecturalImage;
  onOpen: OpenBoardImage;
  children: ReactNode;
}) {
  const [mode, setMode] = useState(0);
  const id = useId();
  const tabList = useRef<HTMLDivElement>(null);
  const board = boards[active.spaceId];

  return (
    <>
      <div
        className="room-explorer-tabs"
        role="tablist"
        aria-label="Space view"
        ref={tabList}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - mode;
          setMode(next);
          tabList.current?.querySelectorAll("button")[next]?.focus();
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={id + "-" + tab.id}
            aria-controls={id + "-panel-" + index}
            aria-selected={mode === index}
            tabIndex={mode === index ? 0 : -1}
            onClick={() => setMode(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={id + "-panel-0"}
        aria-labelledby={id + "-perspectives"}
        hidden={mode !== 0}
      >
        {mode === 0 && children}
      </div>
      <div
        role="tabpanel"
        id={id + "-panel-1"}
        aria-labelledby={id + "-mood-board"}
        hidden={mode !== 1}
      >
        {mode === 1 && (
          board ? <RoomBoardView key={active.spaceId} room={active} board={board} onOpen={onOpen} />
            : <p>No mood board available.</p>
        )}
      </div>
    </>
  );
}
