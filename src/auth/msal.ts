import { PublicClientApplication, InteractionRequiredAuthError, EventType, type AccountInfo } from "@azure/msal-browser";

// const tenantHost = import.meta.env.VITE_B2C_TENANT_HOST;           // <tenant>.b2clogin.com
// const tenantDomain = import.meta.env.VITE_B2C_TENANT_DOMAIN;       // <tenant>.onmicrosoft.com
//const tenantName = import.meta.env.VITE_B2C_TENANT_NAME;
const policy = import.meta.env.VITE_B2C_POLICY;                    // e.g. B2C_1_susi
const clientId = import.meta.env.VITE_B2C_SPA_CLIENT_ID;
// const knownAuthorities = [import.meta.env.VITE_B2C_KNOWN_AUTHORITIES]; 
const CIAM_HOST = import.meta.env.VITE_CIAM_HOST as string;                 // e.g. smartpowerai.ciamlogin.com
const knownAuthorities = [CIAM_HOST];
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

const TENANT_ID = import.meta.env.VITE_CIAM_TENANT_ID as string;           // GUID

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

export const loginRequest: any = {
  authority: AUTHORITY,
  scopes: ["openid", "offline_access", "email", "profile"],
};

export async function initMsal(): Promise<void> {
  console.log("initMsal");

  await msal.initialize();
  console.log("initialized");

  // direct login version
  const result = await msal.handleRedirectPromise().catch(() => undefined);
  
  if (result?.account) {
    msal.setActiveAccount(result.account);
  } else {
    // If nothing came back, prefer any cached account for this authority
    const valid = msal.getAllAccounts()
    .filter(a => (a as any).environment?.toLowerCase() === CIAM_HOST.toLowerCase());
    if (valid.length && !msal.getActiveAccount()) {
      msal.setActiveAccount(valid[0]);
    }
  }
  
  console.log("redirect handled");
  
  
  // pop up log in
  // await msal.handleRedirectPromise().catch(() => { });
  // console.log("redirect handled");
  // const accs = msal.getAllAccounts();

  // console.log("Accounts");
  // console.log(accs);
  // // if (accs.length && !msal.getActiveAccount()) msal.setActiveAccount(accs[0]);

  // const valid = msal
  //   .getAllAccounts()
  //   .filter(a => (a as any).environment?.toLowerCase() === CIAM_HOST.toLowerCase());

  // console.log("got accounts");
  // console.log(valid);



  // if (valid.length && !msal.getActiveAccount()) {
  //   console.log("Accounts");
  //   console.log(valid);


  //   msal.setActiveAccount(valid[0]);
  // }

}

export function getActiveAccount(): AccountInfo | null {
  // dierct sign in version
  const active = msal.getActiveAccount();
  if (active) return active;
  const all = msal.getAllAccounts();
  return all.length ? all[0] : null;

  // pop up version
  // const accs = msal.getAllAccounts();
  // return accs.length ? accs[0] : null;
}


// Call once at startup to ensure the user is signed in; if not, this triggers a redirect and never returns
export function ensureSignedInRedirect(): void {
  const acc = msal.getActiveAccount() ?? msal.getAllAccounts()[0];
  if (acc) return;
  msal.loginRedirect(loginRequest);
  // No code after this line runs on the first pass; page will reload after auth
}

// // pop up version
// export async function ensureSignedIn(): Promise<AccountInfo> {
//   console.log("into ensureSignedIn");
  
//   const acc = getActiveAccount();
//   console.log(acc);

//   if (acc) return acc;
//   console.log("no acc, requesting extra query params");

//   if (policy) loginRequest.extraQueryParameters = { p: policy };

//   console.log(loginRequest);

//   const result = await msal.loginPopup(loginRequest);
//   msal.setActiveAccount(result.account);
//   return result.account;
// }

export async function acquireApiToken(): Promise<string> {
  // direct log in version
  // Expect to already be signed in (call ensureSignedInRedirect() during app bootstrap)
  const account = getActiveAccount();
  const baseReq: any = { authority: AUTHORITY, account, scopes: [apiScope] };

  if (!account) {
    // Not signed in yet; kick off redirect sign-in first
    msal.loginRedirect(loginRequest);
    return new Promise<never>(() => { /* never resolves; navigation occurs */ });
  }

  try {
    const res = await msal.acquireTokenSilent(baseReq);
    return res.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      // Fall back to redirect for interactive consent/auth
      msal.acquireTokenRedirect(baseReq);
      return new Promise<never>(() => { /* never resolves; navigation occurs */ });
    }
    throw e;
  }

  // pop up verison
  // const account = await ensureSignedIn();
  // const baseReq: any = { authority: AUTHORITY, account, scopes: [apiScope] };

  // try {
  //   const res = await msal.acquireTokenSilent(baseReq);
  //   return res.accessToken;
  // } catch (e) {
  //   if (e instanceof InteractionRequiredAuthError) {
  //     const res = await msal.acquireTokenPopup(baseReq);
  //     return res.accessToken;
  //   }
  //   throw e;
  // }
}

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


