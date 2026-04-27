import "./Input.css";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`pixel-input${className ? ` ${className}` : ""}`} {...props} />
  )
);
Input.displayName = "Input";
