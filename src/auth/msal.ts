import { PublicClientApplication, InteractionRequiredAuthError, EventType, type AccountInfo } from "@azure/msal-browser";

const tenantHost = import.meta.env.VITE_B2C_TENANT_HOST;           // <tenant>.b2clogin.com
const tenantDomain = import.meta.env.VITE_B2C_TENANT_DOMAIN;       // <tenant>.onmicrosoft.com
//const tenantName = import.meta.env.VITE_B2C_TENANT_NAME;
const policy = import.meta.env.VITE_B2C_POLICY;                    // e.g. B2C_1_susi
const clientId = import.meta.env.VITE_B2C_SPA_CLIENT_ID;
const knownAuthorities = [import.meta.env.VITE_B2C_KNOWN_AUTHORITIES];
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

export const apiScope =
  import.meta.env.VITE_API_SCOPE ||
  `api://${import.meta.env.VITE_API_CLIENT_ID}/api.user.read`;

export const msal = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://${tenantHost}/${tenantDomain}/v2.0`, // NOTE: no /v2.0 here for SPA authority
    knownAuthorities,
    redirectUri,
    postLogoutRedirectUri: redirectUri
  },
  cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false }
});

export const loginRequest = {
  scopes: ["openid", "offline_access"], // add API scopes later
  extraQueryParameters: { p: policy }, // <- the user flow
};

const tokenRequest = (account: AccountInfo) => ({
  account,
  scopes: [apiScope],
  extraQueryParameters: { p: policy },               // keep policy consistent
});

const logoutRequest = (account?: AccountInfo) => ({
  account,
  postLogoutRedirectUri: redirectUri,
  extraQueryParameters: { p: policy },               // optional but safer for CIAM/B2C
});

export async function initMsal(): Promise<void> {
  console.log("AUTHORITY_BASE:", `https://${tenantHost}/${tenantDomain}/v2.0`);             // https://login.smartpowerai.org/smartpowerai.onmicrosoft.com
  console.log("knownAuthorities:", knownAuthorities);         // ["login.smartpowerai.org"]

  await msal.initialize();
  console.log("handling redirect promise");
  
  await msal.handleRedirectPromise().catch(() => {});
  console.log("getting all accounts");
  
  const accs = msal.getAllAccounts();
  console.log("setting active accounts");
  
  if (accs.length && !msal.getActiveAccount()) msal.setActiveAccount(accs[0]);
}

export function getActiveAccount(): AccountInfo | null {
  console.log("getting active account");
  
  const accs = msal.getAllAccounts();
  console.log("got active account");

  return accs.length ? accs[0] : null;
}

export async function ensureSignedIn(): Promise<AccountInfo> {
  console.log("into ensure signed in - getting active account");
  
  const acc = getActiveAccount();
  if (acc) return acc;

  // First-time login
  console.log("redirecting login");
  
  await msal.loginRedirect(loginRequest);
  // Execution will continue after redirect
  console.log("first time login redirecting");
  
//   return new Promise((_resolve) => {}); // noop; page will reload
  return new Promise(() => {}); // redirect, never resolves
}

export async function acquireApiToken(): Promise<string> {
  console.log("into acquireApiToken - getting active account");
  
  const account = getActiveAccount();
  if (!account) throw new Error("No active account");

  try {
    console.log("acquiring token silent");
    
    const res = await msal.acquireTokenSilent(tokenRequest(account));
    return res.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      console.log("error, acquire token redirect");
      
      await msal.acquireTokenRedirect(tokenRequest(account));
    //   return new Promise((_resolve) => {}); // redirect flow
    return new Promise(() => {}); // redirect
    }
    throw e;
  }
}

// Optional: convenience logout
export async function logout() {
  const account = getActiveAccount() || undefined;
  await msal.logoutRedirect(logoutRequest(account));                    // <-- uses logoutRequest
}

// (Optional) keep the first signed-in account as "active"
msal.addEventCallback((ev) => {
  console.log("into msal event callback: ");
  console.log(ev);
  
  
  if (ev.eventType === EventType.LOGIN_SUCCESS && ev.payload && "account" in ev.payload) {
    const acc = (ev.payload as any).account as AccountInfo;
    console.log("seting active account from event callback");
    
    msal.setActiveAccount(acc);
  }
});
