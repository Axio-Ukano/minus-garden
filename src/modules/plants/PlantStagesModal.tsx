// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useState } from "react";
import type { PlantSpecies } from "./plantService";
import { getStageName, getPlantName } from "./plantService";
import { PlantDisplay } from "./PlantDisplay";
import { PixelCloseButton } from "@/components/PixelCloseButton";
import { useTranslation } from "@/i18n";
import "./PlantStagesModal.css";

// ─── Stage card ───────────────────────────────────────────────────────────────
function StageCard({
  stage,
  name,
  minutes,
  isLast,
  speciesId,
  onSelect,
}: {
  stage: number;
  name: string;
  minutes: number;
  isLast: boolean;
  speciesId: string;
  onSelect: () => void;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`stage-card ${isLast ? "stage-card--final" : ""}`}
      style={{
        minWidth: 110,
        flex: "1 1 110px",
      }}
    >
      {/* Stage number badge */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: 10,
          backgroundColor: "var(--color-accent)",
          border: "2px solid var(--color-border)",
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-xs)",
          color: "#fff",
          padding: "2px 6px",
          lineHeight: 1.2,
        }}
      >
        {stage}
      </div>

      {/* Sprite */}
      <div style={{ marginTop: 4 }}>
        <PlantDisplay stage={stage} speciesId={speciesId} size="lg" />
      </div>

      {/* Stage name */}
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-sm)",
          color: "var(--color-text)",
          letterSpacing: "0.05em",
          textAlign: "center",
        }}
      >
        {name.toUpperCase()}
      </span>

      {/* Time requirement */}
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-xs)",
          color: "var(--color-text-muted)",
          letterSpacing: "0.05em",
        }}
      >
        {minutes === 0 ? t.timer.stage_start : `${minutes} ${t.timer.min_abbr}`}
      </span>
    </button>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function PlantStagesModal({
  isOpen,
  onClose,
  species,
}: {
  isOpen: boolean;
  onClose: () => void;
  species: PlantSpecies;
}) {
  const { t } = useTranslation();
  // Stage shown in the close-up view; null = stage grid
  const [detailStage, setDetailStage] = useState<number | null>(null);

  // Clearing the close-up on every close path means reopening starts at the grid
  const handleClose = () => {
    setDetailStage(null);
    onClose();
  };

  // Escape backs out of the close-up first, then closes the modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (detailStage !== null) setDetailStage(null);
      else onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, detailStage]);

  if (!isOpen) return null;

  const plantName = getPlantName(species, t);
  const detailName = detailStage !== null ? getStageName(detailStage, species, t) : null;
  const detailMinutes = detailStage !== null ? (species.stageThresholds[detailStage - 1] ?? 0) : 0;

  return (
    // Backdrop
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(30, 15, 20, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--color-panel)",
          border: "3px solid var(--color-border)",
          boxShadow: "6px 6px 0 var(--color-pixel-shadow)",
          maxWidth: 720,
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header — stage close-up swaps the titles, keeps the same layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "3px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-lg)",
                color: "var(--color-accent-purple)",
                letterSpacing: "0.1em",
              }}
            >
              {(detailName ?? plantName).toUpperCase()}
            </span>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xs)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.05em",
              }}
            >
              {detailStage !== null
                ? `${plantName.toUpperCase()} · ${t.timer.stage_label} ${detailStage}/${species.maxStages}`
                : `${species.maxStages} ${t.timer.growth_stages}`}
            </span>
          </div>
          <PixelCloseButton onClick={handleClose} />
        </div>

        {detailStage === null ? (
          /* Stage cards — responsive flex-wrap grid */
          <div
            style={{
              padding: 24,
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {species.stageKeys.map((_, i) => (
              <StageCard
                key={i}
                stage={i + 1}
                name={getStageName(i + 1, species, t)}
                minutes={species.stageThresholds[i] ?? 0}
                isLast={i === species.maxStages - 1}
                speciesId={species.id}
                onSelect={() => setDetailStage(i + 1)}
              />
            ))}
          </div>
        ) : (
          /* Stage close-up — click anywhere on it to go back to the grid */
          <button
            type="button"
            onClick={() => setDetailStage(null)}
            aria-label={t.timer.stage_back_hint}
            className="stage-detail"
          >
            <PlantDisplay stage={detailStage} speciesId={species.id} size="xxl" natural />
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-sm)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.05em",
              }}
            >
              {detailMinutes === 0 ? t.timer.stage_start : `${detailMinutes} ${t.timer.min_abbr}`}
            </span>
          </button>
        )}

        {/* Footer hint */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "3px solid var(--color-border)",
            flexShrink: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-xs)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            {detailStage !== null ? t.timer.stage_back_hint : t.timer.close_hint}
          </span>
        </div>
      </div>
    </div>
  );
}
