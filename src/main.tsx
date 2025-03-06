import { createRoot } from "react-dom/client";
import "./index.css";
import "tailwindcss/tailwind.css";
import App from "./App";
import { SessionProvider } from "./context/session";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SessionProvider>
    <App />
  </SessionProvider>
  </BrowserRouter>
);
