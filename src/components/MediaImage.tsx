"use client";
/* Pre-encoded responsive images support static export without an image server. */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { PresentationImage } from "@/types/architecture";
export function MediaImage({
  image,
  priority = false,
  full = false,
  sizes = "(max-width:767px) 100vw, 65vw",
}: {
  image: PresentationImage;
  priority?: boolean;
  full?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className="image-fallback" role="img" aria-label={image.alt}>
        Image unavailable.
        <button onClick={() => setFailed(false)}>Try again</button>
      </div>
    );
  return (
    <img
      src={full ? image.fullSrc : image.src}
      srcSet={
        full
          ? undefined
          : image.sources.map((s) => s.src + " " + s.width + "w").join(", ")
      }
      sizes={full ? undefined : sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority || full ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
