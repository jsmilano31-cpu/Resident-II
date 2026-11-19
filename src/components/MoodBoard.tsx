import Image from "next/image";
import { MediaImage } from "@/components/MediaImage";
import { renderByFile } from "@/data/project";
import styles from "./MoodBoard.module.css";

const details = [
  { image: "soffit", label: "Wood-toned soffit", location: "Above the balcony", ja: "バルコニー上の木目調の軒天" },
  { image: "framing", label: "Dark roof edge", location: "Upper roof, right side", ja: "上段の屋根の右側" },
  { image: "masonry", label: "Pale wall", location: "Right boundary wall", ja: "右側の明るい色の外構壁" },
  { image: "seating", label: "Brown upholstery", location: "Living-room sofa", ja: "リビングのソファの茶色い張り地" },
];

export function MoodBoard() {
  return (
    <section
      className={styles.board}
      aria-labelledby="materials-title"
      data-reveal
    >
      <span className="eyebrow" lang="ja">素材と光</span>
      <h3 id="materials-title">Under the eaves.</h3>
      <div className={styles.grid}>
        <figure className={styles.facade}>
          <MediaImage
            image={renderByFile("MAIN EXTERIOR PERSPECTIVES 2.png")}
            sizes="(max-width: 850px) 90vw, 51vw"
          />
          <figcaption>
            Exterior perspective <span lang="ja">外観</span>
          </figcaption>
        </figure>
        <div className={styles.study}>
          <figure className={styles.room}>
            <MediaImage
              image={renderByFile("LIVING AREA VIEW 2.png")}
              sizes="(max-width: 480px) 90vw, (max-width: 850px) 58vw, 24vw"
            />
            <figcaption>
              Living room <span lang="ja">リビング</span>
            </figcaption>
          </figure>
          <div className={styles.details}>
            {details.map(({ image, label, location, ja }) => (
              <figure key={image}>
                <div className={styles.crop}>
                  <Image src={`/moodboard/${image}.webp`} alt="" fill />
                </div>
                <figcaption>
                  {label}
                  <small>{location}</small>
                  <span lang="ja">{ja}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <p className={styles.note}>
        Details cropped from the supplied architectural renders.
        <span lang="ja">提供された建築パースから細部を抜粋しています。</span>
      </p>
    </section>
  );
}
