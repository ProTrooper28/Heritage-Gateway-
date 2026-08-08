import { useMemo, useState, type CSSProperties } from "react";
import { heritageMonuments, type HeritageMonument } from "@/data/heritageMonuments";

type DriftWallProps = {
  onOpenLogin?: () => void;
};

const columnOffsets = ["0%", "-18%", "-7%", "-28%", "-12%", "-34%"];

function MonumentTile({ monument }: { monument: HeritageMonument }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`drift-tile group ${hovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      aria-label={`${monument.name}, ${monument.city}, ${monument.state}`}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <img
        src={monument.image}
        alt={`${monument.name} in ${monument.city}, ${monument.state}`}
        loading="lazy"
        width={520}
        height={340}
      />
      <div className="drift-tile-scrim" />
      <div className="drift-tile-meta">
        <p className="drift-tile-kicker">{monument.era}</p>
        <h3>{monument.name}</h3>
        <p className="drift-tile-location">
          {monument.city}, {monument.state}
        </p>
        <p className="drift-tile-description">{monument.description}</p>
      </div>
    </article>
  );
}

function DriftColumn({ index, items }: { index: number; items: HeritageMonument[] }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div
      className={`drift-column drift-column-${index + 1}`}
      style={{ "--drift-offset": columnOffsets[index % columnOffsets.length] } as CSSProperties}
    >
      {repeated.map((monument, itemIndex) => (
        <MonumentTile key={`${monument.id}-${index}-${itemIndex}`} monument={monument} />
      ))}
    </div>
  );
}

export function DriftWall({ onOpenLogin }: DriftWallProps) {
  const columns = useMemo(
    () =>
      Array.from({ length: 6 }, (_, columnIndex) =>
        heritageMonuments.filter((_, itemIndex) => itemIndex % 6 === columnIndex),
      ),
    [],
  );

  return (
    <section className="drift-wall" aria-label="Verified Indian heritage monuments">
      <div className="drift-wall-grid" aria-hidden="true">
        {columns.map((items, index) => (
          <DriftColumn key={index} index={index} items={items} />
        ))}
      </div>
      <div className="drift-wall-overlay" />
      <div className="drift-wall-vignette" />
      <div className="drift-wall-brand">
        <p className="drift-wall-eyebrow">A living archive of Indian memory</p>
        <h2>
          Indian
          <br />
          <em>Heritage</em> AI
        </h2>
        <p className="drift-wall-intro">
          Enter a visual atlas of monuments, dynasties, and stories shaped over millennia.
        </p>
        <button type="button" onClick={onOpenLogin} className="drift-wall-cta">
          Begin the journey <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="drift-wall-note">
        Verified local collection · {heritageMonuments.length} monuments
      </div>
    </section>
  );
}
