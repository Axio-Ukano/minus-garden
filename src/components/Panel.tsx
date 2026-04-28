import "./Panel.css";

export function Panel({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pixel-panel${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </div>
  );
}
