// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useState } from "react";
import { useTimerStore } from "../timerStore";
import {
  SEED_CATALOG,
  getSpeciesById,
  getSeedListing,
  getPlantName,
  PlantDisplay,
  PlantStagesModal,
} from "@/modules/plants";
import { useInventoryStore, isSeedOwned } from "@/modules/inventory";
import { useGameModeStore } from "@/modules/gamemode";
import { useSubjectStore } from "@/modules/subjects";
import { useSettingsStore } from "@/modules/settings";
import { PixelArrowButton } from "../../../components/PixelArrowButton";
import { HeartIcon } from "../../../components/PixelIcons";
import { useTranslation } from "../../../i18n";

import { TimerCircle } from "../components/TimerCircle";
import { DurationSelector } from "../components/DurationSelector";
import { SubjectCombobox, capitalize } from "../components/SubjectCombobox";
import "./TimerViews.css";

// Build the carousel list from SEED_CATALOG so order mirrors the shop.
const CAROUSEL_SPECIES = SEED_CATALOG.map((listing) => getSpeciesById(listing.speciesId));

export function TimerSetupView() {
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

  const { durationMinutes, subject, plantSpeciesId, setDuration, setSubject, setPlantSpecies } =
    useTimerStore();

  const { subjects, addSubject, markUsed } = useSubjectStore();
  const plantSide = useSettingsStore((s) => s.plantSide);
  const { t } = useTranslation();

  const ownedSeedIds = useInventoryStore((s) => s.ownedSeedIds);
  const isOwned = (id: string) => isSeedOwned(ownedSeedIds, id);

  const species = getSpeciesById(plantSpeciesId);
  const carouselIndex = CAROUSEL_SPECIES.findIndex((s) => s.id === plantSpeciesId);
  const totalSeconds = durationMinutes * 60;

  const cyclePlant = (dir: -1 | 1) => {
    setSlideDirection(dir === 1 ? "right" : "left");
    const next = (carouselIndex + dir + CAROUSEL_SPECIES.length) % CAROUSEL_SPECIES.length;
    const nextSpecies = CAROUSEL_SPECIES[next];
    if (nextSpecies) setPlantSpecies(nextSpecies.id);
  };

  const handleStart = async () => {
    if (!subject.trim() || !isOwned(plantSpeciesId)) return;
    const finalSubject = capitalize(subject.trim());
    setSubject(finalSubject);

    const existing = subjects.find((s) => s.name.toLowerCase() === finalSubject.toLowerCase());
    if (!existing) {
      await addSubject(finalSubject);
    } else {
      markUsed(existing.id);
    }
    useTimerStore.getState().start();
  };

  const slideAnimation =
    slideDirection === "right"
      ? "slideInRight 0.25s ease-out"
      : slideDirection === "left"
        ? "slideInLeft 0.25s ease-out"
        : "none";

  const plantName = getPlantName(species, t);
  const owned = isOwned(plantSpeciesId);
  const listing = getSeedListing(plantSpeciesId);

  // Determine whether the only blocker is the locked plant (subject is valid but plant locked).
  const subjectBlocked = !subject.trim();
  const plantBlocked = !owned;
  const startDisabled = subjectBlocked || plantBlocked;
  const showLockedHint = !subjectBlocked && plantBlocked;

  return (
    <div className="timer-view">
      <div className="timer-view__grid">
        {/* ── Controls column ── */}
        <div
          className="timer-view__col timer-view__col--controls"
          style={{ order: plantSide === "left" ? 2 : 1 }}
        >
          <div style={{ opacity: 0.8 }}>
            <TimerCircle secondsLeft={totalSeconds} totalSeconds={totalSeconds} faded={false} />
          </div>

          <div className="timer-view__controls-inner">
            <div className="timer-view__field">
              <span
                className="timer-view__field-label"
                style={{ fontSize: "var(--text-pixel-md)" }}
              >
                {t.timer.subject_label}
              </span>
              <SubjectCombobox
                value={subject}
                onChange={setSubject}
                onSubmit={handleStart}
                subjects={subjects}
              />
            </div>
            <div className="timer-view__field" style={{ width: "auto" }}>
              <span
                className="timer-view__field-label"
                style={{ fontSize: "var(--text-pixel-md)" }}
              >
                {t.timer.duration_label}
              </span>
              <DurationSelector value={durationMinutes} onChange={setDuration} />
            </div>

            <button
              type="button"
              data-testid="timer-start"
              className="pixel-btn"
              style={{
                marginTop: 8,
                padding: "16px 48px",
                justifyContent: "center",
                fontSize: "var(--text-pixel-sm)",
                opacity: startDisabled ? 0.5 : 1,
                cursor: startDisabled ? "not-allowed" : "pointer",
              }}
              disabled={startDisabled}
              onClick={handleStart}
            >
              {t.timer.start}
            </button>

            {showLockedHint && (
              <span className="timer-view__locked-hint">{t.timer.locked_hint}</span>
            )}
          </div>
        </div>

        {/* ── Plant column ── */}
        <div
          className="timer-view__col timer-view__col--plant"
          style={{ order: plantSide === "left" ? 1 : 2 }}
        >
          <div className="timer-view__plant-inner">
            <div className="timer-view__plant-name-row">
              <div style={{ position: "absolute", left: 0 }}>
                <PixelArrowButton direction="left" onClick={() => cyclePlant(-1)} />
              </div>

              {/* No lock glyph here: the locked state is already unmistakable
                  from the silhouetted sprite and the LOCKED badge below, and an
                  inline icon shifts the centered name off-axis (worse with long
                  names / locales). */}
              <span
                key={species.id}
                className="timer-view__plant-name"
                style={{ animation: slideAnimation }}
              >
                {plantName.toUpperCase()}
              </span>

              <div style={{ position: "absolute", right: 3 }}>
                <PixelArrowButton direction="right" onClick={() => cyclePlant(1)} />
              </div>
            </div>

            <div
              key={`sprite-${species.id}`}
              className="timer-view__plant-sprite"
              style={{ animation: slideAnimation }}
            >
              <div className={owned ? undefined : "timer-view__plant-sprite--locked"}>
                <PlantDisplay
                  stage={species.maxStages}
                  speciesId={plantSpeciesId}
                  size="xl"
                  natural
                />
              </div>
            </div>

            <div
              key={`data-${species.id}`}
              className="timer-view__plant-meta"
              style={{ animation: slideAnimation }}
            >
              {owned ? (
                <>
                  <span
                    className="timer-view__field-label"
                    style={{ fontSize: "var(--text-pixel-md)" }}
                  >
                    {species.maxStages} {t.timer.stages_count}
                  </span>
                  <span
                    className="timer-view__field-label"
                    style={{ fontSize: "var(--text-pixel-md)" }}
                  >
                    {t.timer.up_to} {species.stageThresholds[species.maxStages - 1]}{" "}
                    {t.timer.min_abbr}
                  </span>
                  <button
                    type="button"
                    className="pixel-btn-link"
                    style={{ fontSize: "var(--text-pixel-md)" }}
                    onClick={() => setIsStagesModalOpen(true)}
                  >
                    {t.timer.view_stages}
                  </button>
                </>
              ) : (
                <>
                  <span data-testid="timer-plant-locked" className="timer-view__locked-badge">
                    {t.timer.locked_badge}
                  </span>
                  <span className="timer-view__locked-price">
                    <HeartIcon size={10} color="var(--color-heart)" />
                    <span>{listing.price}</span>
                  </span>
                  <button
                    type="button"
                    data-testid="timer-view-in-shop"
                    className="pixel-btn-link"
                    style={{ fontSize: "var(--text-pixel-md)" }}
                    onClick={() => useGameModeStore.getState().openShopAt(species.id)}
                  >
                    {t.timer.view_in_shop}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <PlantStagesModal
        isOpen={isStagesModalOpen}
        onClose={() => setIsStagesModalOpen(false)}
        species={species}
      />
    </div>
  );
}
