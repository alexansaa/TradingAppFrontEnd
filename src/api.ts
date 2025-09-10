import { acquireApiToken } from "./auth/msal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getPublicPing() {
  const r = await fetch(`${API_BASE_URL}/api/hello`);
  if (!r.ok) throw new Error(`Ping failed: ${r.status}`);
  return r.json();
}

export async function getProfile() {
  const token = await acquireApiToken();
  const r = await fetch(`${API_BASE_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) throw new Error(`Profile failed: ${r.status}`);
  return r.json();
}
