import { acquireApiToken } from "./auth/msal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getPublicPing() {
  const token = await acquireApiToken();
  const headers = new Headers({});
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  
  console.log(`Fetching: ${API_BASE_URL}/api/hello`);
  
  const res = await fetch(`http://localhost:8080/api/hello`, { headers });
  // Optional: better messages
  if (res.status === 401) throw new Error("Unauthorized (401) – token missing/invalid/expired");
  if (res.status === 403) throw new Error("Forbidden (403) – token lacks required scope");

  return res.json();
}

export async function getProfile() {
  const token = await acquireApiToken();
  const r = await fetch(`${API_BASE_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) throw new Error(`Profile failed: ${r.status}`);
  return r.json();
}
