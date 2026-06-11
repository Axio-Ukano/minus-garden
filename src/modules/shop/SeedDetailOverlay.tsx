// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Seed detail overlay ──────────────────────────────────────────────────────
// Per-species catalog page: packet art, tier, flavor text, growth facts and a
// stage preview that stays silhouetted until the seed is owned — buying it is
// the reveal moment. Purchases use a two-step confirm that disarms itself.

import { useEffect, useRef, useState } from "react";
import {
  getSeedListing,
  getSpeciesById,
  getPlantName,
  PlantDisplay,
  SeedPacketDisplay,
  MINUTES_PER_HEART,
} from "@/modules/plants";
import { useInventoryStore } from "@/modules/inventory";
import { useHistoryStore } from "@/modules/history";
import { useSettingsStore } from "@/modules/settings";
import { audioService } from "@/modules/audio";
import { HeartIcon } from "@/components/PixelIcons";
import { PixelCloseButton } from "@/components/PixelCloseButton";
import { pushToast } from "@/lib/toast";
import { useTranslation } from "@/i18n";
import type { Translations } from "@/i18n";

type SeedDescKey = keyof Translations["shop"]["desc"];

const CONFIRM_DISARM_MS = 3500;

function playPurchaseSfx() {
  const s = useSettingsStore.getState();
  const master = s.masterMuted ? 0 : s.masterVolume;
  const sfx = s.sfxMuted ? 0 : s.sfxVolume;
  audioService.playSfx("plant_grow", master, sfx);
}

interface SeedDetailOverlayProps {
  speciesId: string;
  onClose: () => void;
  onGrow?: (speciesId: string) => void;
}

export function SeedDetailOverlay({ speciesId, onClose, onGrow }: SeedDetailOverlayProps) {
  const [armed, setArmed] = useState(false);
  const [justBought, setJustBought] = useState(false);
  const disarmTimer = useRef<number | null>(null);

  const ownedSeedIds = useInventoryStore((s) => s.ownedSeedIds);
  const purchasing = useInventoryStore((s) => s.purchasing);
  const totalHearts = useHistoryStore((s) => s.totalHearts);
  const { t } = useTranslation();

  const species = getSpeciesById(speciesId);
  const listing = getSeedListing(speciesId);
  const owned = speciesId === "daisy" || ownedSeedIds.has(speciesId);
  const affordable = totalHearts >= listing.price;
  const plantName = getPlantName(species, t);
  const description = t.shop.desc[speciesId as SeedDescKey] ?? "";
  const fullBloomMinutes = species.stageThresholds[species.maxStages - 1] ?? 0;

  // ESC closes the detail (the layer itself has no ESC binding).
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Transient purchase state resets naturally on species change: the parent
  // remounts this overlay per species (key={speciesId}). Only the pending
  // disarm timer needs explicit cleanup on unmount.
  useEffect(
    () => () => {
      if (disarmTimer.current !== null) window.clearTimeout(disarmTimer.current);
    },
    []
  );

  const handleBuy = async () => {
    if (purchasing) return;
    if (!armed) {
      setArmed(true);
      disarmTimer.current = window.setTimeout(() => setArmed(false), CONFIRM_DISARM_MS);
      return;
    }
    if (disarmTimer.current !== null) window.clearTimeout(disarmTimer.current);
    setArmed(false);
    const outcome = await useInventoryStore.getState().purchaseSeed(speciesId);
    if (outcome) {
      setJustBought(true);
      playPurchaseSfx();
      pushToast(`${plantName} ${t.shop.bought_toast}`, "success");
    }
  };

  return (
    <div className="shop-detail" data-testid="shop-detail" onClick={onClose}>
      <div
        className="shop-detail__panel"
        role="dialog"
        aria-label={t.shop.detail_aria}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shop-detail__header">
          <div className="shop-detail__heading">
            <h2 className="shop-detail__title">{plantName.toUpperCase()}</h2>
            <span className="shop-tier" data-tier={listing.tier}>
              {t.shop.tier[listing.tier]}
            </span>
          </div>
          <span data-testid="shop-detail-close">
            <PixelCloseButton onClick={onClose} />
          </span>
        </div>

        <div className="shop-detail__scroll">
          <div className="shop-detail__body">
            <div className="shop-detail__left">
              <div className="shop-detail__packet">
                <SeedPacketDisplay speciesId={speciesId} size="xl" />
                <span className="shop-detail__packet-shelf" aria-hidden="true" />
              </div>
              <span className="shop-detail__price">
                {listing.price === 0 ? (
                  t.shop.free_price
                ) : (
                  <>
                    <HeartIcon size={11} color="var(--color-heart)" />
                    <span>{listing.price}</span>
                  </>
                )}
              </span>
            </div>

            <div className="shop-detail__info">
              <p className="shop-detail__desc">{description}</p>
              <div className="shop-detail__facts">
                <span className="shop-detail__fact">
                  <span className="shop-detail__fact-label">{t.shop.stages_label}</span>
                  <span>{species.maxStages}</span>
                </span>
                <span className="shop-detail__fact">
                  <span className="shop-detail__fact-label">{t.shop.full_bloom}</span>
                  <span>
                    {fullBloomMinutes} {t.shop.min_abbr}
                  </span>
                </span>
              </div>

              <div className="shop-detail__preview">
                <span className="shop-detail__preview-title">{t.shop.preview_title}</span>
                <div className="shop-detail__stages">
                  {Array.from({ length: species.maxStages }, (_, i) => i + 1).map((stage) => (
                    <span
                      key={stage}
                      className={`shop-detail__stage${
                        owned
                          ? justBought
                            ? " shop-detail__stage--reveal"
                            : ""
                          : " shop-detail__stage--hidden"
                      }`}
                      style={justBought ? { animationDelay: `${(stage - 1) * 60}ms` } : undefined}
                    >
                      <PlantDisplay stage={stage} speciesId={speciesId} size="md" natural />
                    </span>
                  ))}
                </div>
                {!owned && (
                  <span className="shop-detail__preview-hint">{t.shop.preview_hidden}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="shop-detail__footer">
          {owned ? (
            <div className="shop-detail__footer-col">
              <span className="shop-detail__owned-label">{t.shop.in_collection}</span>
              <button
                className="pixel-btn-secondary shop-detail__grow"
                data-testid="shop-grow"
                onClick={() => onGrow?.(speciesId)}
              >
                {t.shop.grow_this}
              </button>
            </div>
          ) : affordable ? (
            <button
              className={`pixel-btn shop-detail__buy${armed ? " shop-detail__buy--armed" : ""}`}
              data-testid={armed ? "shop-confirm" : "shop-buy"}
              disabled={purchasing}
              onClick={handleBuy}
            >
              <span>{armed ? t.shop.confirm_buy : t.shop.buy}</span>
              <HeartIcon size={11} color="#fff" />
              <span>{listing.price}</span>
            </button>
          ) : (
            <div className="shop-detail__footer-row">
              <button className="pixel-btn shop-detail__buy" data-testid="shop-buy" disabled>
                <span>{t.shop.missing_prefix}</span>
                <HeartIcon size={11} color="#fff" />
                <span>{listing.price - totalHearts}</span>
              </button>
              <span className="shop-detail__earn-hint">
                {MINUTES_PER_HEART} {t.shop.earn_hint}{" "}
                <HeartIcon size={9} color="var(--color-heart)" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
