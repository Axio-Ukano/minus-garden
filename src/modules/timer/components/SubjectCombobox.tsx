// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useRef, useState, useMemo } from "react";
import type { Subject } from "../../subjects/subjectStore";
import { Input } from "@/components/Input";
import "@/components/Panel.css";
import { useTranslation } from "../../../i18n";
import "./SubjectCombobox.css";

/** Capitalize the first letter of a string */
// eslint-disable-next-line react-refresh/only-export-components
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SubjectCombobox({
  value,
  onChange,
  onSubmit,
  subjects,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  subjects: Subject[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and sort alphabetically
  const filtered = useMemo(() => {
    return [...subjects]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((s) => s.name.toLowerCase().includes(value.trim().toLowerCase()));
  }, [subjects, value]);

  const exactMatch = subjects.find((s) => s.name.toLowerCase() === value.trim().toLowerCase());
  const showCreateOption = value.trim() && !exactMatch;

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: 300 }}>
      <Input
        data-testid="subject-input"
        maxLength={50}
        style={{
          width: "100%",
          fontSize: "var(--text-pixel-md)",
          padding: "12px 16px",
          boxSizing: "border-box",
        }}
        placeholder={t.subjects.placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsOpen(false);
            onSubmit();
          }
          if (e.key === "Escape") setIsOpen(false);
        }}
      />

      {isOpen && (
        <div
          className="pixel-border"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 8,
            backgroundColor: "var(--color-panel)",
            zIndex: 20,
            maxHeight: 200,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Create new option */}
          {showCreateOption && (
            <button
              className="pixel-dropdown-item"
              style={{
                borderBottom: "2px solid var(--color-border)",
                fontSize: "var(--text-pixel-sm)",
                color: "var(--color-accent-hover)",
              }}
              onClick={() => handleSelect(capitalize(value.trim()))}
            >
              + {t.subjects.create} &quot;{value.trim()}&quot;
            </button>
          )}

          {/* Empty state hint */}
          {!value.trim() && (
            <div
              style={{
                padding: "12px 16px",
                textAlign: "left",
                background: "transparent",
                borderBottom: "2px solid var(--color-border)",
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-sm)",
                color: "var(--color-accent-hover)",
              }}
            >
              {t.subjects.type_to_create}
            </div>
          )}

          {/* Filtered subject list */}
          {filtered.map((s) => (
            <button
              key={s.id}
              className="pixel-dropdown-item"
              style={{ fontSize: "var(--text-pixel-sm)" }}
              onClick={() => handleSelect(s.name)}
            >
              {s.name}
            </button>
          ))}

          {/* No results */}
          {filtered.length === 0 && !showCreateOption && value.trim() && (
            <div
              style={{
                padding: "12px 16px",
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              {t.subjects.no_subjects}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
