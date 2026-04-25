import { useState } from "react";
import { useTimerStore } from "../timerStore";
import { useSubjectStore } from "../../subjects/subjectStore";
import { ALL_SPECIES, getSpeciesById, getPlantName } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { PixelArrowButton } from "../../../components/PixelArrowButton";
import { useSettingsStore } from "../../settings/settingsStore";
import { useTranslation } from "../../../i18n";

import { TimerCircle } from "../components/TimerCircle";
import { DurationSelector } from "../components/DurationSelector";
import { SubjectCombobox, capitalize } from "../components/SubjectCombobox";
import { PlantStagesModal } from "../components/PlantStagesModal";
import "./TimerViews.css";

export function TimerSetupView() {
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

  const { durationMinutes, subject, plantSpeciesId, setDuration, setSubject, setPlantSpecies } =
    useTimerStore();

  const { subjects, addSubject, markUsed } = useSubjectStore();
  const plantSide = useSettingsStore((s) => s.plantSide);
  const { t } = useTranslation();

  const species = getSpeciesById(plantSpeciesId);
  const speciesIndex = ALL_SPECIES.findIndex((s) => s.id === plantSpeciesId);
  const totalSeconds = durationMinutes * 60;

  const cyclePlant = (dir: -1 | 1) => {
    setSlideDirection(dir === 1 ? "right" : "left");
    const next = (speciesIndex + dir + ALL_SPECIES.length) % ALL_SPECIES.length;
    setPlantSpecies(ALL_SPECIES[next].id);
  };

  const handleStart = async () => {
    if (!subject.trim()) return;
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
              className="pixel-btn"
              style={{
                marginTop: 8,
                padding: "16px 48px",
                justifyContent: "center",
                fontSize: "var(--text-pixel-sm)",
                opacity: !subject.trim() ? 0.5 : 1,
                cursor: !subject.trim() ? "not-allowed" : "pointer",
              }}
              disabled={!subject.trim()}
              onClick={handleStart}
            >
              {t.timer.start}
            </button>
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

              <span
                key={species.id}
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: 22,
                  color: "var(--color-text)",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  animation: slideAnimation,
                }}
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
              <PlantDisplay stage={species.maxStages} speciesId={plantSpeciesId} size="xl" />
            </div>

            <div
              key={`data-${species.id}`}
              className="timer-view__plant-meta"
              style={{ animation: slideAnimation }}
            >
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
                {t.timer.up_to} {species.stageThresholds[species.maxStages - 1]} {t.timer.min_abbr}
              </span>
            </div>

            <button
              className="pixel-btn-link"
              style={{ fontSize: "var(--text-pixel-md)" }}
              onClick={() => setIsStagesModalOpen(true)}
            >
              {t.timer.view_stages}
            </button>
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
