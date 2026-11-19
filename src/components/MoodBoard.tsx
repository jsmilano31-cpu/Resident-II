import Image from "next/image";
import { MediaImage } from "@/components/MediaImage";
import { renderByFile } from "@/data/project";
import styles from "./MoodBoard.module.css";

const finishes = [
  { label: "Timber soffit", ja: "木目の軒天", color: "#845e40" },
  { label: "Dark framing", ja: "濃色のフレーム", color: "#41413f" },
  { label: "Pale masonry", ja: "淡色の石積み", color: "#d8cdbb" },
  { label: "Warm upholstery", ja: "暖色の張り地", color: "#755646" },
];

export function MoodBoard() {
  return (
    <div className={styles.board} role="region" aria-labelledby="materials-title" data-reveal>
      <span className="eyebrow" lang="ja">素材と光</span>
      <h3 id="materials-title">Materials in light.</h3>
      <div className={styles.grid}>
        <div className={styles.facade}>
          <MediaImage image={renderByFile("MAIN EXTERIOR PERSPECTIVES 2.png")} sizes="(max-width: 700px) 90vw, 52vw" />
        </div>
        <div className={styles.room}>
          <MediaImage image={renderByFile("LIVING AREA VIEW 2.png")} sizes="(max-width: 700px) 90vw, 36vw" />
        </div>
        <div className={styles.details} aria-hidden="true">
          {["soffit", "framing", "masonry"].map((detail) => (
            <div key={detail} className={styles.detail}>
              <Image src={`/moodboard/${detail}.webp`} alt="" fill sizes="(max-width: 700px) 28vw, 12vw" />
            </div>
          ))}
        </div>
      </div>
      <ul className={styles.legend} aria-label="Material palette">
        {finishes.map(({ label, ja, color }) => (
          <li key={label}>
            <i style={{ backgroundColor: color }} aria-hidden="true" />
            <span>{label}<small lang="ja">{ja}</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
