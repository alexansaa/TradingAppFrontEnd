import { useEffect, useState } from "react";
import { getPublicPing, getProfile } from "./api";
import "./App.css";
import { API_BASE_URL } from "./config";

// MSAL helpers (from the earlier snippet you added in src/auth/msal.ts)
// import { msal, apiScope, getActiveAccount, logout } from "./auth/msal";
import { getActiveAccount, logout } from "./auth/msal";

export default function App() {
  // auth state
  const [authReady, setAuthReady] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // data for the authenticated view
  const [ping, setPing] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // demo stuff for the default Vite page
  const [count, setCount] = useState(0);
  const [pingResult, setPingResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Process B2C redirect (if any) and detect auth
  useEffect(() => {
    (async () => {
      // await handleRedirect();                // handle MSAL redirect result (if returning from B2C)
      console.log("getting active account");
      
      setIsAuth(!!getActiveAccount());       // authenticated if we have an account
      console.log("set is auth");
      setAuthReady(true);
      console.log("set is auth ready");
    })();
  }, []);

  // When authenticated, load data
  useEffect(() => {
    if (!isAuth) return;
    console.log("user auth and load data");
    getPublicPing().then(setPing).catch(console.error);
    console.log("already pigned public");
    getProfile().then(setProfile).catch(console.error);
    console.log("progile obtained");

  }, [isAuth]);

  // const signIn = async () => {
  //   await msal.loginRedirect({
  //     scopes: ["openid", "profile", "offline_access", apiScope],
  //   });
  //   // After redirect & return, initMsal() (in main.tsx) will set the active account,
  //   // and this component will re-mount with isAuth=true.
  // };

  const signOut = async () => {
    await logout();
  };

  const handlePing = async () => {
    setIsLoading(true);
    try {
      const result = await getPublicPing();
      setPingResult(JSON.stringify(result, null, 2));
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error(`Error: ${msg}`);
      setPingResult(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional loading placeholder while MSAL processes the redirect hash
  if (!authReady) return null;

  // ===== Authenticated view (your first return block) =====
  if (isAuth) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Trading SPA</h1>
        <div style={{ marginBottom: 12 }}>
          <button onClick={signOut}>Sign out</button>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
          API: {API_BASE_URL}
        </div>
        <pre>Public ping: {JSON.stringify(ping, null, 2)}</pre>
        <pre>Profile: {JSON.stringify(profile, null, 2)}</pre>

        <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <br />

        <button onClick={handlePing} disabled={isLoading}>
          {isLoading ? "Pinging..." : "Test Public Ping"}
        </button>

        <br />

        {pingResult && (
          <pre
            style={{
              textAlign: "left",
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "0.8rem",
            }}
          >
            {pingResult}
          </pre>
        )}
      </div>
      </div>
    );
  }
}
