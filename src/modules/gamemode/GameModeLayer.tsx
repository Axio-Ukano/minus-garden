// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Game-mode layer ──────────────────────────────────────────────────────────
// The meta-progression side of the app: a garden world that slides in over the
// study desk. Renders both the entry (a gate tab on the right edge of the
// content area) and the layer itself (left rail: shop / garden / minigames).
// Study tabs stay in the bottom dock; selecting one closes this layer.

import { useGameModeStore, type GameSection } from "./gameModeStore";
import { ShopView } from "@/modules/shop";
import { PlantDisplay } from "@/modules/plants";
import {
  ChevronIcon,
  FenceIcon,
  GamepadIcon,
  ShopStallIcon,
  SproutIcon,
} from "@/components/PixelIcons";
import { useTranslation } from "@/i18n";
import type { Translations } from "@/i18n";
import "./GameModeLayer.css";

interface GameModeLayerProps {
  /** Owned seed chosen in the shop — parent selects it on the study desk. */
  onGrowSpecies: (speciesId: string) => void;
}

interface RailSection {
  id: GameSection;
  label: keyof Translations["gamemode"];
  soon: boolean;
}

const RAIL_SECTIONS: RailSection[] = [
  { id: "shop", label: "shop", soon: false },
  { id: "garden", label: "garden", soon: true },
  { id: "minigames", label: "minigames", soon: true },
];

function SectionIcon({ section, active }: { section: GameSection; active: boolean }) {
  if (section === "shop") return <ShopStallIcon size={20} />;
  if (section === "garden") return <FenceIcon size={20} />;
  // The gamepad's d-pad/buttons are punched in the surface color behind it.
  return <GamepadIcon size={20} bg={active ? "var(--gamemode-accent)" : "var(--color-panel)"} />;
}

/** Placeholder for sections that are designed but not built yet. */
function ComingSoonPanel({ section }: { section: Exclude<GameSection, "shop"> }) {
  const { t } = useTranslation();
  const isGarden = section === "garden";

  return (
    <div className="gamemode-soon">
      <div className="gamemode-soon__panel">
        <span className="gamemode-soon__badge">{t.gamemode.sprouting_badge}</span>
        <div className="gamemode-soon__art">
          {isGarden ? (
            <PlantDisplay stage={2} speciesId="daisy" size="lg" natural />
          ) : (
            <GamepadIcon size={56} bg="var(--color-panel)" />
          )}
        </div>
        <h2 className="gamemode-soon__title">
          {isGarden ? t.gamemode.garden_teaser_title : t.gamemode.minigames_teaser_title}
        </h2>
        <p className="gamemode-soon__body">
          {isGarden ? t.gamemode.garden_teaser_body : t.gamemode.minigames_teaser_body}
        </p>
      </div>
    </div>
  );
}

export function GameModeLayer({ onGrowSpecies }: GameModeLayerProps) {
  const isOpen = useGameModeStore((s) => s.isOpen);
  const section = useGameModeStore((s) => s.section);
  const shopDetailSpeciesId = useGameModeStore((s) => s.shopDetailSpeciesId);
  const { t } = useTranslation();

  return (
    <>
      {/* Gate tab — the door into the garden world, on the right edge. */}
      <button
        className="gamemode-gate"
        data-testid="gamemode-gate"
        onClick={() => useGameModeStore.getState().open()}
        aria-label={t.gamemode.gate_aria}
        title={t.gamemode.gate_tooltip}
        tabIndex={isOpen ? -1 : 0}
      >
        <SproutIcon size={18} />
        <span className="gamemode-gate__label">{t.gamemode.garden}</span>
      </button>

      <div
        className={`gamemode-layer${isOpen ? " gamemode-layer--open" : ""}`}
        data-testid="gamemode-layer"
        aria-hidden={!isOpen}
      >
        {/* Canopy — a full-width striped band that frames the layer's top edge
            against the app header, spanning rail and content as one piece. */}
        <div className="gamemode-canopy" aria-hidden="true" />

        <div className="gamemode-layer__row">
          {/* Rail — back to the desk on top, then the world's sections. */}
          <nav className="gamemode-rail" aria-label={t.gamemode.gate_aria}>
            <button
              className="gamemode-rail__back"
              data-testid="gamemode-back"
              onClick={() => useGameModeStore.getState().close()}
              aria-label={t.gamemode.back_aria}
              title={t.gamemode.back_tooltip}
              tabIndex={isOpen ? 0 : -1}
            >
              <span className="gamemode-rail__back-chevron">
                <ChevronIcon size={14} direction="down" />
              </span>
            </button>

            {RAIL_SECTIONS.map((entry) => {
              const active = section === entry.id;
              return (
                <button
                  key={entry.id}
                  className={`gamemode-rail__section${active ? " gamemode-rail__section--active" : ""}`}
                  data-testid={`gamemode-section-${entry.id}`}
                  onClick={() => useGameModeStore.getState().setSection(entry.id)}
                  aria-pressed={active}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <SectionIcon section={entry.id} active={active} />
                  <span className="gamemode-rail__section-label">{t.gamemode[entry.label]}</span>
                  {entry.soon && <span className="gamemode-rail__soon">{t.gamemode.soon_tag}</span>}
                </button>
              );
            })}
          </nav>

          <div className="gamemode-content">
            {section === "shop" && (
              <ShopView
                detailSpeciesId={shopDetailSpeciesId}
                onSelectSpecies={(id) => useGameModeStore.getState().setShopDetail(id)}
                onGrowSpecies={onGrowSpecies}
              />
            )}
            {section === "garden" && <ComingSoonPanel section="garden" />}
            {section === "minigames" && <ComingSoonPanel section="minigames" />}
          </div>
        </div>
      </div>
    </>
  );
}
