import { Tooltip } from "./Tooltip";
import { useTranslation } from "@/i18n";
import "./InfoTooltip.css";

interface InfoTooltipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  align?: "center" | "start" | "end";
  maxWidth?: number;
}

export function InfoTooltip({
  text,
  position = "top",
  align = "center",
  maxWidth = 180,
}: InfoTooltipProps) {
  const { t } = useTranslation();

  return (
    <Tooltip text={text} position={position} align={align} maxWidth={maxWidth}>
      <button
        className="info-tooltip-btn"
        tabIndex={-1}
        type="button"
        aria-label={t.common.info}
      >
        ⓘ
      </button>
    </Tooltip>
  );
}
