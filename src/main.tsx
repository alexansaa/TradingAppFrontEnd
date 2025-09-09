import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initMsal, ensureSignedIn } from "./auth/msal";

async function start() {
  await initMsal();   // process MSAL redirects (if returning from B2C)
  await ensureSignedIn();   // triggers redirect to B2C if not signed in
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

start();
