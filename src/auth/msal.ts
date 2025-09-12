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
    authority: `https://${tenantHost}/${tenantDomain}`,
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
  await msal.initialize();
  await msal.handleRedirectPromise().catch(() => {});
  const accs = msal.getAllAccounts();
  console.log("Accounts");
  console.log(accs);
  
  if (accs.length && !msal.getActiveAccount()) msal.setActiveAccount(accs[0]);
}

export function getActiveAccount(): AccountInfo | null {
  const accs = msal.getAllAccounts();
  return accs.length ? accs[0] : null;
}

export async function ensureSignedIn(): Promise<AccountInfo> {
  const acc = getActiveAccount();
  if (acc) return acc;
  const result = await msal.loginPopup(loginRequest);
  msal.setActiveAccount(result.account);
  return result.account;
}

export async function acquireApiToken(): Promise<string> {
  console.log("acquiring token");
  
  const account = getActiveAccount();
  if (!account) throw new Error("No active account");

  try {
    console.log("about to call acquireTokenSilent");
    
    const res = await msal.acquireTokenSilent(tokenRequest(account));
    console.log("aquired tokens:");
    console.log(res.accessToken);
    
    
    return res.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      const result = await msal.acquireTokenPopup(tokenRequest(account));
      return result.accessToken;
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
  if (ev.eventType === EventType.LOGIN_SUCCESS && ev.payload && "account" in ev.payload) {
    const acc = (ev.payload as any).account as AccountInfo;
    
    msal.setActiveAccount(acc);
  }
});
