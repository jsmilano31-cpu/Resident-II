import "./setup-dom";
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { images, spaces } from "../src/data/project";
import boards from "../src/data/room-moodboards.json";
import { ArchitecturalGallery } from "../src/components/ArchitecturalGallery";

afterEach(cleanup);

test("the gallery shows each room board with captions and on-demand images", () => {
  const view = render(<ArchitecturalGallery items={images} label="All rooms" />);
  const perspectives = view.getByRole("tab", { name: "Perspectives" });
  const moodBoard = view.getByRole("tab", { name: "Mood board" });
  assert.equal(perspectives.getAttribute("aria-selected"), "true");
  assert.equal(view.container.querySelector('img[src*="/room-moodboards/"]'), null);

  perspectives.focus();
  fireEvent.keyDown(perspectives, { key: "End" });
  assert.equal(document.activeElement, moodBoard);

  for (const room of spaces) {
    fireEvent.change(view.getByRole("combobox"), { target: { value: room.id } });
    const panel = within(view.getByRole("tabpanel", { name: "Mood board" }));
    const board = boards[room.id as keyof typeof boards];
    assert.ok(panel.getByText(room.name));
    assert.ok(panel.getByText(room.japanese));
    assert.equal(panel.getAllByRole("img").length, board.details.length + 1);
    for (const detail of board.details) {
      assert.ok(panel.getByText(detail.label));
      assert.ok(panel.getByText(detail.ja));
    }
    assert.equal(view.queryByRole("button", { name: "Next angle" }), null);
  }

  fireEvent.click(view.getByRole("button", { name: "Shared spaces" }));
  assert.equal(moodBoard.getAttribute("aria-selected"), "true");
  assert.ok(within(view.getByRole("tabpanel")).getByText("Living room"));
  fireEvent.keyDown(moodBoard, { key: "ArrowLeft" });
  assert.equal(document.activeElement, perspectives);
});

test("mood boards preserve the room angle and share the expandable image viewer", () => {
  const view = render(<ArchitecturalGallery items={images} label="All rooms" />);
  fireEvent.click(view.getByRole("button", { name: "Living room, angle 2" }));
  const angle = images.filter((image) => image.spaceId === "living")[1];
  fireEvent.click(view.getByRole("tab", { name: "Mood board" }));
  const panel = within(view.getByRole("tabpanel"));
  const main = panel.getByRole("button", { name: "Enlarge: Living room" });
  const detail = panel.getAllByRole("button", { name: /^Enlarge:/ })[1];
  for (const button of [main, detail]) {
    fireEvent.click(button);
    const dialog = within(view.getByRole("dialog"));
    assert.ok(dialog.getByRole("img").getAttribute("src")?.endsWith(button === main ? "2560.webp" : "full.webp"));
    assert.equal(dialog.queryByRole("button", { name: "Next image" }), null);
    fireEvent.click(dialog.getByRole("button", { name: /^Close/ }));
    assert.equal(document.activeElement, button);
  }

  fireEvent.click(view.getByRole("tab", { name: "Perspectives" }));
  assert.ok(view.getByRole("button", { name: "Enlarge: " + angle.caption }));
});
