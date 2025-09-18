import React, {
  // useEffect
} from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from 'react-redux';
import store from './redux/store';
import "./index.css";
// import {
//   initMsal,
//   // ensureSignedIn,    // pop up sign in
//   ensureSignedInRedirect
// } from "./auth/msal";

async function start() {
  // // pop up redirect
  // console.log("starting");

  // await initMsal();
  // console.log("ensuring signed in");

  // await ensureSignedIn();
  // console.log("out fron ensuredsigned in");

  // direct log in is implemented on App.tsx

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

start();
