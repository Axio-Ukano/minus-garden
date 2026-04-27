import { useSettingsStore, type Language } from "@/modules/settings";
import { en } from "./en";
import { es } from "./es";
import type { DeepTranslation } from "./types";
import type { Translations } from "./en";

export type { Translations, Language };

// es satisfies DeepTranslation<Translations> (checked in es.ts) but its string
// literals are wider than Translations — use a union type for the map value.
type AnyTranslation = Translations | DeepTranslation<Translations>;

const LOCALES: Record<Language, AnyTranslation> = { en, es };

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  return { t: LOCALES[language] as Translations, language };
}
