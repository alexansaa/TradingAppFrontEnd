import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initMsal, ensureSignedIn } from "./auth/msal";

async function start() {
  await initMsal();
  await ensureSignedIn();
  
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

start();
