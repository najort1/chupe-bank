import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </NextUIProvider>
  </StrictMode>
);
