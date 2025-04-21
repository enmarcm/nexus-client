import { createRoot } from "react-dom/client";
import "./index.css";
import "tailwindcss/tailwind.css";
import App from "./App";
import { SessionProvider } from "./context/session";
import { BrowserRouter } from "react-router";
import { EmailDataGlobalProvider } from "./context/EmailDataGlobal";
import { SmsDataProvider } from "./context/SmsDataGlobal";
import { LogProvider } from "./context/LogContext";
import { LoaderProvider } from "./context/LoaderContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SessionProvider>
      <LoaderProvider>

      <LogProvider>
        <EmailDataGlobalProvider>
          <SmsDataProvider>
            <App />
          </SmsDataProvider>
        </EmailDataGlobalProvider>
      </LogProvider>
      </LoaderProvider>
    </SessionProvider>
  </BrowserRouter>
);
