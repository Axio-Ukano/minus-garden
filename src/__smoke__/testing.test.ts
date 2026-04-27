import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(true).toBe(true);
  });

  it("loads jest-dom matchers", () => {
    const div = document.createElement("div");
    div.textContent = "hello";
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent("hello");
    document.body.removeChild(div);
  });
});
