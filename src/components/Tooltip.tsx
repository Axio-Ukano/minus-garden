import { ReactNode, useRef, useState, useEffect, CSSProperties } from "react";
import { createPortal } from "react-dom";
import "./InfoTooltip.css";

export interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "center" | "start" | "end";
  maxWidth?: number;
  wrapStyle?: CSSProperties;
}

interface BubblePos {
  top: number;
  left: number;
  ready: boolean;
}

const GAP = 6;

function computePos(
  anchor: DOMRect,
  bubble: DOMRect,
  position: string,
  align: string,
): { top: number; left: number } {
  const vw = window.innerWidth;
  let top = 0;
  let left = 0;

  if (position === "top") {
    top = anchor.top - bubble.height - GAP;
  } else if (position === "bottom") {
    top = anchor.bottom + GAP;
  } else if (position === "left") {
    top = anchor.top + anchor.height / 2 - bubble.height / 2;
    left = anchor.left - bubble.width - GAP;
    return { top, left };
  } else {
    top = anchor.top + anchor.height / 2 - bubble.height / 2;
    left = anchor.right + GAP;
    return { top, left };
  }

  if (align === "center") {
    left = anchor.left + anchor.width / 2 - bubble.width / 2;
  } else if (align === "start") {
    left = anchor.left;
  } else {
    left = anchor.right - bubble.width;
  }

  left = Math.max(6, Math.min(left, vw - bubble.width - 6));
  return { top, left };
}

export function Tooltip({
  text,
  children,
  position = "top",
  align = "center",
  maxWidth = 180,
  wrapStyle,
}: TooltipProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [bubblePos, setBubblePos] = useState<BubblePos>({ top: -9999, left: -9999, ready: false });

  useEffect(() => {
    if (!visible) {
      setBubblePos({ top: -9999, left: -9999, ready: false });
      return;
    }
    const id = requestAnimationFrame(() => {
      if (!wrapRef.current || !bubbleRef.current) return;
      const anchor = wrapRef.current.getBoundingClientRect();
      const bubble = bubbleRef.current.getBoundingClientRect();
      const { top, left } = computePos(anchor, bubble, position, align);
      setBubblePos({ top, left, ready: true });
    });
    return () => cancelAnimationFrame(id);
  }, [visible, position, align, text]);

  if (!text) return <>{children}</>;

  return (
    <span
      ref={wrapRef}
      className="info-tooltip-wrap"
      style={wrapStyle}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        createPortal(
          <span
            ref={bubbleRef}
            className="info-tooltip-bubble info-tooltip-bubble--portal"
            style={{
              top: bubblePos.top,
              left: bubblePos.left,
              maxWidth,
              opacity: bubblePos.ready ? 1 : 0,
            }}
          >
            {text}
          </span>,
          document.body
        )}
    </span>
  );
}
