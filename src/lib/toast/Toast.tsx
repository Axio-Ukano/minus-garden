// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useState } from "react";
import "./Toast.css";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3250 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      const showTimer = setTimeout(() => setIsVisible(true), 10);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation before removing from DOM
      }, duration);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      const hideTimer = setTimeout(() => setIsVisible(false), 10);
      return () => clearTimeout(hideTimer);
    }
  }, [message, duration, onClose]);

  if (!message && !isVisible) return null;

  return (
    <div className={`pixel-toast ${isVisible ? "visible" : ""}`}>
      {message}
      <div className="pixel-toast-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
}
