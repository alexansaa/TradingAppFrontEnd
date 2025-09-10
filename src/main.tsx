import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initMsal, ensureSignedIn } from "./auth/msal";

async function start() {
  console.log("root starting app -  init msal call");
  
  await initMsal();   // process MSAL redirects (if returning from B2C)

  console.log("ensuring signed in");
  
  await ensureSignedIn();   // triggers redirect to B2C if not signed in

  console.log("creating root doc");
  
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log("calling start method");

start();
