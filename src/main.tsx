import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const fontStylesheet = document.createElement("link");
fontStylesheet.rel = "stylesheet";
fontStylesheet.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontStylesheet);

// Auto-reload when a stale chunk fails to load after a redeploy
const RELOAD_KEY = "__chunk_reload_attempt";
const handleChunkError = (message?: string) => {
  if (!message) return;
  const isChunkError =
    /Importing a module script failed|Failed to fetch dynamically imported module|Loading chunk \d+ failed|ChunkLoadError/i.test(
      message
    );
  if (!isChunkError) return;
  if (sessionStorage.getItem(RELOAD_KEY)) return;
  sessionStorage.setItem(RELOAD_KEY, "1");
  window.location.reload();
};
window.addEventListener("error", (e) => handleChunkError(e.message));
window.addEventListener("unhandledrejection", (e) =>
  handleChunkError(String((e as PromiseRejectionEvent).reason?.message ?? ""))
);
window.addEventListener("load", () => sessionStorage.removeItem(RELOAD_KEY));

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing application root");
createRoot(rootElement).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
