import { HeartIcon } from "../../../components/HeartIcon";

export function TimerHeader({ totalHearts }: { totalHearts: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "24px 32px 8px",
        flexShrink: 0,
      }}
    >
      <div /> {/* Spacer */}
      {/* Global title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
        <HeartIcon size={20} color="var(--color-accent-purple)" />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-2xl)",
            color: "var(--color-accent-purple)",
            letterSpacing: "0.1em",
            paddingTop: 4,
          }}
        >
          MINU&apos;S GARDEN
        </span>
        <HeartIcon size={20} color="var(--color-accent-purple)" />
      </div>
      {/* Hearts counter */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-md)",
            color: "var(--color-heart)",
            opacity: totalHearts === 0 ? 0.3 : 1,
          }}
        >
          <HeartIcon size={16} color="var(--color-heart)" />
          <span style={{ paddingTop: 2 }}>× {totalHearts}</span>
        </div>
      </div>
    </div>
  );
}
