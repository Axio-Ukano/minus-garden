import { useState } from "react";
import { useTimerStore } from "../timerStore";
import { useHistoryStore } from "../../history/historyStore";
import { useSubjectStore } from "../../subjects/subjectStore";
import { ALL_SPECIES, getSpeciesById } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { PixelArrowButton } from "../../../components/PixelArrowButton";

import { TimerCircle } from "../components/TimerCircle";
import { DurationSelector } from "../components/DurationSelector";
import { SubjectCombobox, capitalize } from "../components/SubjectCombobox";
import { TimerHeader } from "../components/TimerHeader";
import { PlantStagesModal } from "../components/PlantStagesModal";

// ─── Shared label style ───────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-pixel)",
  fontSize: "var(--text-pixel-xs)",
  color: "var(--color-text-muted)",
  letterSpacing: "0.1em",
};

export function TimerSetupView() {
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

  const { durationMinutes, subject, plantSpeciesId, setDuration, setSubject, setPlantSpecies } =
    useTimerStore();

  const totalHearts = useHistoryStore((s) => s.totalHearts);
  const { subjects, addSubject, markUsed } = useSubjectStore();

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        backgroundColor: "var(--color-bg)",
        boxSizing: "border-box",
      }}
    >
      <TimerHeader totalHearts={totalHearts} />

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          paddingTop: 16,
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            padding: "16px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 20,
          }}
        >
          <div style={{ opacity: 0.8 }}>
            <TimerCircle secondsLeft={totalSeconds} totalSeconds={totalSeconds} faded={false} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              width: "100%",
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                width: "100%",
              }}
            >
              <span style={{ ...labelStyle, fontSize: "var(--text-pixel-md)" }}>MATERIA</span>
              <SubjectCombobox
                value={subject}
                onChange={setSubject}
                onSubmit={handleStart}
                subjects={subjects}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
            >
              <span style={{ ...labelStyle, fontSize: "var(--text-pixel-md)" }}>DURACIÓN</span>
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
              COMENZAR
            </button>
          </div>
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 32px",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div
              style={{
                position: "relative",
                width: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 48,
              }}
            >
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
                  animation:
                    slideDirection === "right"
                      ? "slideInRight 0.25s ease-out"
                      : slideDirection === "left"
                        ? "slideInLeft 0.25s ease-out"
                        : "none",
                }}
              >
                {species.name.toUpperCase()}
              </span>

              <div style={{ position: "absolute", right: 3 }}>
                <PixelArrowButton direction="right" onClick={() => cyclePlant(1)} />
              </div>
            </div>
            <div
              key={`sprite-${species.id}`}
              style={{
                width: 140,
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation:
                  slideDirection === "right"
                    ? "slideInRight 0.25s ease-out"
                    : slideDirection === "left"
                      ? "slideInLeft 0.25s ease-out"
                      : "none",
              }}
            >
              <PlantDisplay stage={species.maxStages} speciesId={plantSpeciesId} size="xl" />
            </div>
            <div
              key={`data-${species.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                animation:
                  slideDirection === "right"
                    ? "slideInRight 0.25s ease-out"
                    : slideDirection === "left"
                      ? "slideInLeft 0.25s ease-out"
                      : "none",
              }}
            >
              <span style={{ ...labelStyle, fontSize: "var(--text-pixel-md)" }}>
                {species.maxStages} ETAPAS
              </span>
              <span style={{ ...labelStyle, fontSize: "var(--text-pixel-md)" }}>
                HASTA {species.stageThresholds[species.maxStages - 1]} MIN
              </span>
            </div>
            <button
              className="pixel-btn-link"
              style={{ fontSize: "var(--text-pixel-md)" }}
              onClick={() => setIsStagesModalOpen(true)}
            >
              VER ETAPAS ›
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
