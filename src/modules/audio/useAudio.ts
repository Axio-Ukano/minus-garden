import { useEffect, useRef } from "react";
import { useSettingsStore } from "@/modules/settings";
import { useAudioStore } from "./audioStore";
import { audioService } from "./audioService";
import type { SfxId } from "./audioService";

let lastTypingSfxTime = 0;

export function useAudio() {
  const {
    masterVolume,
    sfxVolume,
    ambientVolume,
    musicVolume,
    masterMuted,
    musicMuted,
    ambientMuted,
    sfxMuted,
    clickSfxId,
    typingSfxId,
    ambientRandomize,
    ambientRandomizeMinutes,
    ambientRandomizePool,
  } = useSettingsStore();
  const { activeAmbient } = useAudioStore();

  // Sync volume changes to audioService
  useEffect(() => {
    const effMaster = masterMuted ? 0 : masterVolume;
    const effAmbient = ambientMuted ? 0 : ambientVolume;
    audioService.setAmbientVolume(effMaster, effAmbient);
  }, [masterVolume, ambientVolume, masterMuted, ambientMuted]);

  useEffect(() => {
    const effMaster = masterMuted ? 0 : masterVolume;
    const effMusic = musicMuted ? 0 : musicVolume;
    audioService.setMusicVolume(effMaster, effMusic);
  }, [masterVolume, musicVolume, masterMuted, musicMuted]);

  // Sync ambient randomizer
  useEffect(() => {
    useAudioStore.getState().syncAmbientRandomizer({
      ambientRandomize,
      ambientRandomizeMinutes,
      ambientRandomizePool,
    });
  }, [ambientRandomize, ambientRandomizeMinutes, ambientRandomizePool]);

  // Global button-click SFX via mousedown delegation
  const sfxRef = useRef({
    master: masterMuted ? 0 : masterVolume,
    sfx: sfxMuted ? 0 : sfxVolume,
    clickSfxId,
    typingSfxId,
  });
  useEffect(() => {
    sfxRef.current = {
      master: masterMuted ? 0 : masterVolume,
      sfx: sfxMuted ? 0 : sfxVolume,
      clickSfxId,
      typingSfxId,
    };
  }, [masterMuted, masterVolume, sfxMuted, sfxVolume, clickSfxId, typingSfxId]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") && !target.closest("[data-no-sfx]")) {
        const { master, sfx, clickSfxId: id } = sfxRef.current;
        if (id !== "none") {
          audioService.playSfx(id as SfxId, master, sfx);
        }
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // Typing SFX — throttled at 80ms
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { master, sfx, typingSfxId: id } = sfxRef.current;
      if (id === "none") return;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (!isInput) return;
      if (e.key.length !== 1) return;
      const now = Date.now();
      if (now - lastTypingSfxTime < 80) return;
      lastTypingSfxTime = now;
      audioService.playSfx(id as SfxId, master, sfx);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Suppress unused warning — activeAmbient is observed to trigger re-volume on ambient changes
  void activeAmbient;
}
