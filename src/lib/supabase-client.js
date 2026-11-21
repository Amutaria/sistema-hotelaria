const STORAGE_KEY = "hotelpro_supabase_session";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  return { url: url.replace(/\/$/, ""), key };
}

function saveSession(session) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

function readSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export async function signInWithPassword(email, password) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || "Não foi possível entrar. Verifique e-mail e senha.");
  saveSession(result);
  return result;
}

async function refreshSession(session) {
  const { url, key } = getConfig();
  if (!session?.refresh_token) return null;
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
  const renewed = await response.json();
  saveSession(renewed);
  return renewed;
}

export async function getAccessToken() {
  let session = readSession();
  if (!session?.access_token) return null;
  const expiresAt = session.expires_at || (session.expires_in ? Math.floor(Date.now() / 1000) + session.expires_in : 0);
  if (expiresAt && expiresAt < Math.floor(Date.now() / 1000) + 60) {
    session = await refreshSession(session);
  }
  return session?.access_token || null;
}

export async function apiFetch(path, options = {}) {
  let token = await getAccessToken();
  if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
  const send = (accessToken) => fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  let response = await send(token);
  if (response.status === 401) {
    const renewed = await refreshSession(readSession());
    if (renewed?.access_token) response = await send(renewed.access_token);
  }
  if (response.status === 401) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    throw new Error("Sua sessão expirou. Entre novamente.");
  }
  return response;
}

export async function signOut() {
  const { url, key } = getConfig();
  const token = await getAccessToken();
  if (token) {
    await fetch(`${url}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
}
