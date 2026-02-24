const API_BASE = 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('smartbus_token');
}

function setToken(token: string): void {
  localStorage.setItem('smartbus_token', token);
}

function removeToken(): void {
  localStorage.removeItem('smartbus_token');
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; phone?: string; countryCode?: string }) =>
    apiRequest('/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/login', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => apiRequest('/profile'),

  updateProfile: (data: { name?: string; phone?: string; countryCode?: string; role?: string; onboardingDone?: boolean }) =>
    apiRequest('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/change-password', { method: 'PUT', body: JSON.stringify(data) }),

  deleteAccount: () => apiRequest('/account', { method: 'DELETE' }),

  // Cart / Payment
  createOrder: (data: { plan: string; price: number }) =>
    apiRequest('/cart', { method: 'POST', body: JSON.stringify(data) }),

  checkout: (orderId: string, plan: string) =>
    apiRequest(`/checkout/${orderId}`, { method: 'POST', body: JSON.stringify({ plan }) }),

  getOrders: () => apiRequest('/orders'),

  // QR
  generateQR: (data: any) =>
    apiRequest('/generate-qr', { method: 'POST', body: JSON.stringify({ data }) }),
};

export { getToken, setToken, removeToken };
