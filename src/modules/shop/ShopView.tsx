// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Seed shop ────────────────────────────────────────────────────────────────
// The storefront of the game-mode layer: an awning, a hearts balance, category
// stalls (seeds live, the rest visibly "coming soon") and seed packets resting
// on continuous wooden shelves. Clicking a packet opens its detail overlay.
// The open detail is controlled by the parent (game-mode store), so deep links
// like the timer's "view in shop" need no synchronization here.

import { SEED_CATALOG, getSpeciesById, getPlantName, SeedPacketDisplay } from "@/modules/plants";
import { useInventoryStore } from "@/modules/inventory";
import { useHistoryStore } from "@/modules/history";
import { HeartIcon } from "@/components/PixelIcons";
import { useTranslation } from "@/i18n";
import { SeedDetailOverlay } from "./SeedDetailOverlay";
import "./ShopView.css";

interface ShopViewProps {
  /** Species whose detail overlay is open (null = browsing the catalog). */
  detailSpeciesId: string | null;
  /** Open (id) or close (null) the detail overlay. */
  onSelectSpecies: (speciesId: string | null) => void;
  /** "Grow this one" on an owned seed — parent navigates to the timer. */
  onGrowSpecies?: (speciesId: string) => void;
}

/** Stalls that exist in the floor plan but aren't built yet. */
const FUTURE_CATEGORIES = ["tools", "decor", "upgrades", "plots"] as const;

export function ShopView({ detailSpeciesId, onSelectSpecies, onGrowSpecies }: ShopViewProps) {
  const ownedSeedIds = useInventoryStore((s) => s.ownedSeedIds);
  const totalHearts = useHistoryStore((s) => s.totalHearts);
  const { t } = useTranslation();

  const isOwned = (id: string) => id === "daisy" || ownedSeedIds.has(id);
  const ownedCount = SEED_CATALOG.filter((listing) => isOwned(listing.speciesId)).length;

  return (
    <div className="shop-view" data-testid="shop-view">
      <header className="shop-header">
        <div className="shop-header__titles">
          <h2 className="shop-header__title">{t.shop.title}</h2>
          <p className="shop-header__tagline">{t.shop.tagline}</p>
        </div>
        {/* The hearts balance intentionally lives only in the app header — a
            second wallet here would be a duplicate. The shop's own status is
            collection progress. */}
        <span className="shop-header__collected">
          {ownedCount}/{SEED_CATALOG.length} {t.shop.collected}
        </span>
      </header>

      <div className="shop-categories">
        <button className="shop-categories__tab shop-categories__tab--active" aria-pressed="true">
          {t.shop.categories.seeds}
        </button>
        {FUTURE_CATEGORIES.map((key) => (
          <button
            key={key}
            className="shop-categories__tab shop-categories__tab--soon"
            disabled
            aria-disabled="true"
            title={t.shop.category_soon}
          >
            <span>{t.shop.categories[key]}</span>
            <span className="shop-categories__soon-tag">{t.gamemode.soon_tag}</span>
          </button>
        ))}
      </div>

      <div className="shop-shelves">
        {SEED_CATALOG.map((listing) => {
          const species = getSpeciesById(listing.speciesId);
          const owned = isOwned(listing.speciesId);
          const affordable = totalHearts >= listing.price;

          return (
            <button
              key={listing.speciesId}
              className="shop-shelf-item"
              data-testid={`shop-item-${listing.speciesId}`}
              onClick={() => onSelectSpecies(listing.speciesId)}
            >
              <span className="shop-shelf-item__sprite">
                <SeedPacketDisplay speciesId={listing.speciesId} size="xl" />
              </span>
              <span className="shop-shelf-item__board" aria-hidden="true" />
              <span className="shop-shelf-item__name">
                {getPlantName(species, t).toUpperCase()}
              </span>
              {listing.speciesId === "daisy" ? (
                <span className="shop-chip shop-chip--starter">{t.shop.starter_badge}</span>
              ) : owned ? (
                <span className="shop-chip shop-chip--owned">{t.shop.owned_badge}</span>
              ) : (
                <span className={`shop-price${affordable ? "" : " shop-price--dim"}`}>
                  <HeartIcon size={10} color="var(--color-heart)" />
                  <span>{listing.price}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {detailSpeciesId !== null && (
        <SeedDetailOverlay
          key={detailSpeciesId}
          speciesId={detailSpeciesId}
          onClose={() => onSelectSpecies(null)}
          onGrow={onGrowSpecies}
        />
      )}
    </div>
  );
}
