import { useEffect, useState } from "react";
import {
  getPublicPing,
  // getProfile
} from "./api";
import "./App.css";
// import { API_BASE_URL } from "./config";

// MSAL helpers (from the earlier snippet you added in src/auth/msal.ts)
// import { msal, apiScope, getActiveAccount, logout } from "./auth/msal";
import {
  initMsal,
  ensureSignedInRedirect,
  acquireApiToken,
  getActiveAccount,
  // logout
} from "./auth/msal";
import { BarChart3, TrendingUp } from "lucide-react";
import ConfigureTradeSection from "./components/ConfigureTradeSection";
import HistorySection from "./components/HistorySection";
import PriceChart from "./components/PriceChart";
import SignalsSection from "./components/SignalsSection";

export default function App() {
  // auth state
  const [authReady, setAuthReady] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // // data for the authenticated view
  // const [ping, setPing] = useState<any>(null);
  // const [profile, setProfile] = useState<any>(null);

  // // demo stuff for the default Vite page
  // const [count, setCount] = useState(0);
  const [pingResult, setPingResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Process B2C redirect (if any) and detect auth

  // direct login
  useEffect(() => {
    (async () => {
      // 1) Initialize MSAL and process any incoming redirect hash
      await initMsal();

      // 2) If not logged in, this will navigate to the IdP and NOT return
      ensureSignedInRedirect();

      // 3) If we are already signed in (post-redirect or cached), reflect it
      const hasAccount = !!getActiveAccount();
      setIsAuth(hasAccount);
      setAuthReady(true);

      // 4) Optional: warm an API token silently now (if signed in)
      if (hasAccount) {
        try {
          await acquireApiToken();
        } catch {
          // If consent is required later, acquireApiToken() will trigger a redirect then.
        }
      }
    })();
  }, []);

  // pop uo login
  // useEffect(() => {
  //   console.log("app setisauth usereffect");
    
  //   (async () => {
  //     setIsAuth(!!getActiveAccount());       // authenticated if we have an account
  //     setAuthReady(true);
  //     console.log("acquiring api token");
      
  //     acquireApiToken();
  //   })();
  // }, []);

  // When authenticated, load data
  // useEffect(() => {
  //   if (!isAuth) return;
  //   getPublicPing().then(setPing).catch(console.error);
  //   getProfile().then(setProfile).catch(console.error);

  // }, [isAuth]);

  // const signOut = async () => {
  //   await logout();
  // };

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
  // if (isAuth) {
  //   return (
  //     <div style={{ padding: 16 }}>
  //       <h1>Trading SPA</h1>
  //       <div style={{ marginBottom: 12 }}>
  //         <button onClick={signOut}>Sign out</button>
  //       </div>
  //       <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
  //         API: {API_BASE_URL}
  //       </div>
  //       <pre>Public ping: {JSON.stringify(ping, null, 2)}</pre>
  //       <pre>Profile: {JSON.stringify(profile, null, 2)}</pre>

  //       <div className="card">
  //       <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
  //       <br />

  //       <button onClick={handlePing} disabled={isLoading}>
  //         {isLoading ? "Pinging..." : "Test Public Ping"}
  //       </button>

  //       <br />

  //       {pingResult && (
  //         <pre
  //           style={{
  //             textAlign: "left",
  //             marginTop: "1rem",
  //             padding: "1rem",
  //             backgroundColor: "#f5f5f5",
  //             borderRadius: "4px",
  //             fontSize: "0.8rem",
  //           }}
  //         >
  //           {pingResult}
  //         </pre>
  //       )}
  //     </div>
  //     </div>
  //   );
  // }

  if (isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-slate-blue/10 to-dark">
        {/* Header */}
        <header className="bg-dark/80 backdrop-blur-sm border-b border-tan/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold rounded-lg">
                  <BarChart3 className="text-dark" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">TradeFlow Pro</h1>
                  <p className="text-tan text-sm">Advanced Trading Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-white font-semibold">$124,567.89</div>
                  <div className="text-green-400 text-sm flex items-center gap-1">
                    <TrendingUp size={14} />
                    +2.34%
                  </div>
                </div>
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-dark font-bold">JP</span>
                </div>
              </div>
            </div>
          </div>
        </header>

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Price Chart */}
          <PriceChart />

          {/* Three Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SignalsSection />
            <HistorySection />
            <ConfigureTradeSection />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-blue rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-tan text-sm">Active Signals</div>
            </div>
            <div className="bg-slate-blue rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">18</div>
              <div className="text-tan text-sm">Winning Trades</div>
            </div>
            <div className="bg-slate-blue rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gold">72%</div>
              <div className="text-tan text-sm">Success Rate</div>
            </div>
            <div className="bg-slate-blue rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">$4,280</div>
              <div className="text-tan text-sm">Total P&L</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
