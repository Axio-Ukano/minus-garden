import { useTranslation } from "@/i18n";

export function WipSection({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="settings-section__title">{title}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          gap: 16,
          color: "var(--color-text-muted)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.5 }}>🚧</div>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-sm)",
            letterSpacing: "0.05em",
          }}
        >
          {t.settings.wip.badge}
        </div>
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          {t.settings.wip.body}
        </p>
      </div>
    </div>
  );
}
