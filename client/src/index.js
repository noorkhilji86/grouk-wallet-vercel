import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const tg = window?.Telegram?.WebApp;
if (tg) { try { tg.ready(); tg.expand(); } catch {} }

const root = createRoot(document.getElementById("root"));
root.render(<App />);
