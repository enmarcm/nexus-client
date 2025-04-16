import { createRoot } from "react-dom/client";
import "./index.css";
import "tailwindcss/tailwind.css";
import App from "./App";
import { SessionProvider } from "./context/session";
import { BrowserRouter } from "react-router";
import { EmailDataGlobalProvider } from "./context/EmailDataGlobal";
import { SmsDataProvider } from "./context/SmsDataGlobal";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SessionProvider>
      <EmailDataGlobalProvider>
        <SmsDataProvider>

        <App />
        </SmsDataProvider>
      </EmailDataGlobalProvider>
    </SessionProvider>
  </BrowserRouter>
);
