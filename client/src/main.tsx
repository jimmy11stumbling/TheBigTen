import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Initialize theme before React renders to prevent flash
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = savedTheme || systemTheme;

  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute("data-theme", theme);
}

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);