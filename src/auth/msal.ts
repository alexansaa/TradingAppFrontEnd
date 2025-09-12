import { PublicClientApplication, InteractionRequiredAuthError, EventType, type AccountInfo } from "@azure/msal-browser";

// const tenantHost = import.meta.env.VITE_B2C_TENANT_HOST;           // <tenant>.b2clogin.com
// const tenantDomain = import.meta.env.VITE_B2C_TENANT_DOMAIN;       // <tenant>.onmicrosoft.com
//const tenantName = import.meta.env.VITE_B2C_TENANT_NAME;
const policy = import.meta.env.VITE_B2C_POLICY;                    // e.g. B2C_1_susi
const clientId = import.meta.env.VITE_B2C_SPA_CLIENT_ID;
// const knownAuthorities = [import.meta.env.VITE_B2C_KNOWN_AUTHORITIES]; 
const CIAM_HOST   = import.meta.env.VITE_CIAM_HOST as string;                 // e.g. smartpowerai.ciamlogin.com
const knownAuthorities = [CIAM_HOST]; 
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

const TENANT_ID   = import.meta.env.VITE_CIAM_TENANT_ID as string;           // GUID

const AUTHORITY = `https://${CIAM_HOST}/${TENANT_ID}`;

export const apiScope =
  import.meta.env.VITE_API_SCOPE;

export const msal = new PublicClientApplication({
  auth: {
    clientId,
    // authority: `https://${tenantHost}/${tenantDomain}/api.user.read`,
    authority: AUTHORITY,
    knownAuthorities,
    redirectUri,
    postLogoutRedirectUri: redirectUri
  },
  cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false }
});

// export const loginRequest = {
//   scopes: ["openid", "offline_access"], // add API scopes later
//   extraQueryParameters: { p: policy }, // <- the user flow
// };

export const loginRequest: any = {
  authority: AUTHORITY,
  scopes: ["openid", "offline_access", "email", "profile"],
};

// const tokenRequest = (account: AccountInfo) => ({
//   account,
//   scopes: [apiScope],
//   extraQueryParameters: { p: policy },               // keep policy consistent
// });

// const logoutRequest = (account?: AccountInfo) => ({
//   account,
//   postLogoutRedirectUri: redirectUri,
//   extraQueryParameters: { p: policy },               // optional but safer for CIAM/B2C
// });

export async function initMsal(): Promise<void> {
  console.log("initMsal");
  
  await msal.initialize();
  console.log("initialized");
  
  await msal.handleRedirectPromise().catch(() => {});
  console.log("redirect handled");
  



  
  const accs = msal.getAllAccounts();
  
    console.log("Accounts");
    console.log(accs);
  // if (accs.length && !msal.getActiveAccount()) msal.setActiveAccount(accs[0]);

  const valid = msal
    .getAllAccounts()
    .filter(a => (a as any).environment?.toLowerCase() === CIAM_HOST.toLowerCase());

  console.log("got accounts");
  console.log(valid);
  
  

  if (valid.length && !msal.getActiveAccount()) {
    console.log("Accounts");
    console.log(valid);
    
    
    msal.setActiveAccount(valid[0]);
  }
  
}

export function getActiveAccount(): AccountInfo | null {
  const accs = msal.getAllAccounts();
  return accs.length ? accs[0] : null;
}

export async function ensureSignedIn(): Promise<AccountInfo> {
  console.log("into ensureSignedIn");
  
  const acc = getActiveAccount();
  console.log(acc);
  
  if (acc) return acc;
  console.log("no acc, requesting extra query params");

  if (policy) loginRequest.extraQueryParameters = { p: policy };

  console.log(loginRequest);
  
  const result = await msal.loginPopup(loginRequest);
  msal.setActiveAccount(result.account);
  return result.account;
}

export async function acquireApiToken(): Promise<string> {
  console.log("acquiring token");
  const account = await ensureSignedIn();

  // const baseReq: any = { authority: AUTHORITY, account, scopes: [apiScope] };

  console.log("loking for scope");
  console.log(apiScope);
  
  
  
  const baseReq: any = { authority: `https://${CIAM_HOST}/${TENANT_ID}`, account, scopes: [apiScope] };
  // if (policy) baseReq.extraQueryParameters = { p: policy };

  try {
    const res = await msal.acquireTokenSilent(baseReq);
    return res.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      const res = await msal.acquireTokenPopup(baseReq);
      return res.accessToken;
    }
    throw e;
  }
}

// // Optional: convenience logout
// export async function logout() {
//   const account = getActiveAccount() || undefined;
//   await msal.logoutRedirect(logoutRequest(account));                    // <-- uses logoutRequest
// }

// // (Optional) keep the first signed-in account as "active"
// msal.addEventCallback((ev) => {
//   if (ev.eventType === EventType.LOGIN_SUCCESS && ev.payload && "account" in ev.payload) {
//     const acc = (ev.payload as any).account as AccountInfo;
    
//     msal.setActiveAccount(acc);
//   }
// });

/** Optional helpers */
export function getGrantedScopes(token: string): string[] {
  try { return (JSON.parse(atob(token.split(".")[1])).scp || "").split(" ").filter(Boolean); }
  catch { return []; }
}

export async function logout(): Promise<void> {
  const account = getActiveAccount() || undefined;
  const req: any = { account, postLogoutRedirectUri: redirectUri, authority: AUTHORITY };
  if (policy) req.extraQueryParameters = { p: policy };
  await msal.logoutPopup(req);
}

/** Keep first successful login as active */
msal.addEventCallback((ev) => {
  if (ev.eventType === EventType.LOGIN_SUCCESS && ev.payload && "account" in ev.payload) {
    msal.setActiveAccount((ev.payload as any).account as AccountInfo);
  }
});


