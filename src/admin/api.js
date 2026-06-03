const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export const getToken = () => localStorage.getItem('adminToken');
export const isLoggedIn = () => !!getToken();

const authHeaders = (isMultipart = false) => {
  const h = { Authorization: `Token ${getToken()}` };
  if (!isMultipart) h['Content-Type'] = 'application/json';
  return h;
};

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data ? JSON.stringify(data) : `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem('adminToken', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('adminToken');
}

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function apiPost(path, body, isMultipart = false) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(isMultipart),
    body: isMultipart ? body : JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPatch(path, body, isMultipart = false) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(isMultipart),
    body: isMultipart ? body : JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDel(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}
