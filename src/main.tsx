import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from 'react-redux';
import store from './redux/store';
import "./index.css";
import { initMsal, ensureSignedIn } from "./auth/msal";

async function start() {
  console.log("starting");
  
  await initMsal();
  console.log("ensuring signed in");
  
  await ensureSignedIn();
  console.log("out fron ensuredsigned in");
  
  
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

start();
