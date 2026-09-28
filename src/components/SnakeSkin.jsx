// The scale motif. One geometry, reused at three scales: a faint field behind a
// section, a solid swatch for a colorway, and a hairline rule between sections.

const TILE_W = 26;
const TILE_H = 15;

// Two interlocking rows of domed scales. Drawn as strokes so the texture reads as
// relief rather than as a pattern of blocks.
const SCALE_PATH = [
  `M -13 ${TILE_H} Q 0 -1 13 ${TILE_H}`,
  `M 13 ${TILE_H} Q 26 -1 39 ${TILE_H}`,
  `M 0 ${TILE_H / 2} Q 13 ${-1 - TILE_H / 2} 26 ${TILE_H / 2}`,
].join(" ");

export function ScalePattern({ id, color, opacity, scale = 1 }) {
  return (
    <pattern
      id={id}
      width={TILE_W * scale}
      height={TILE_H * scale}
      patternUnits="userSpaceOnUse"
      patternTransform={`scale(${scale})`}
    >
      <path
        d={SCALE_PATH}
        fill="none"
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth="1"
      />
    </pattern>
  );
}

/**
 * A texture layer for a section background. Absolutely positioned and inert, so it
 * never intercepts a click or reaches a screen reader.
 */
export function ScaleField({
  id,
  color,
  opacity = 0.5,
  scale = 1.6,
  className = "",
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    >
      <defs>
        <ScalePattern id={id} color={color} opacity={opacity} scale={scale} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * A colorway swatch: the species color, scaled skin over it, and the single
 * brushed-gold accent line that runs the length of every band.
 */
export function ScaleSwatch({
  id,
  color,
  textureColor,
  textureOpacity = 0.45,
  className = "",
}) {
  // The pattern is laid down in user space rather than through a stretched viewBox,
  // so a scale stays the same shape whatever width the card ends up at.
  return (
    <div
      className={`relative h-full w-full ${className}`}
      style={{ backgroundColor: color }}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
        <defs>
          <ScalePattern
            id={id}
            color={textureColor}
            opacity={textureOpacity}
            scale={0.85}
          />
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-[64%] h-[2px] bg-gold-600"
      />
    </div>
  );
}

/** A hairline of scales, used as a section rule. */
export function ScaleRule({
  id,
  color = "#9a9486",
  opacity = 0.7,
  className = "",
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 260 ${TILE_H}`}
      className={`h-[15px] w-[260px] ${className}`}
    >
      <defs>
        <ScalePattern id={id} color={color} opacity={opacity} />
      </defs>
      <rect width="260" height={TILE_H} fill={`url(#${id})`} />
    </svg>
  );
}
