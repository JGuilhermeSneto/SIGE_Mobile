const API_BASE_URL = 'http://192.168.18.90:8080';

let AUTH_TOKEN = null;
let REFRESH_TOKEN = null;
let USER_INFO = null;

export const setAuthToken = (token) => {
  AUTH_TOKEN = token;
};

export const setRefreshToken = (token) => {
  REFRESH_TOKEN = token;
};

export const getAuthToken = () => {
  return AUTH_TOKEN;
};

export const setUserInfo = (user) => {
  USER_INFO = user;
};

export const getUserInfo = () => {
  return USER_INFO;
};

export const login = async (identifier, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: identifier, // Aceita username, email ou matrícula
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao autenticar.');
    }

    setAuthToken(data.access);
    if (data.refresh) setRefreshToken(data.refresh);
    setUserInfo(data.user);
    return data;
  } catch (error) {
    console.error('Erro de autenticação:', error);
    throw error;
  }
};

export const logout = () => {
  AUTH_TOKEN = null;
  USER_INFO = null;
};

export const getDashboard = async () => {
  return requestWithAuth('/api/v1/aluno/dashboard/');
};

export const getBoletim = async () => {
  return requestWithAuth('/api/v1/aluno/boletim/');
};

export const getPerfil = async () => {
  return requestWithAuth('/api/v1/aluno/perfil/');
};

export const putPerfil = async (dados) => {
  return requestWithAuth('/api/v1/aluno/perfil/', { method: 'PUT', body: JSON.stringify(dados) });
};

export const getRoteiro = async () => {
  return requestWithAuth('/api/v1/aluno/roteiro/');
};

export const getMateriais = async () => {
  return requestWithAuth('/api/v1/aluno/materiais/');
};

export const getAtividades = async () => {
  return requestWithAuth('/api/v1/academico/atividades/');
};

// --- Helper functions ---
const defaultHeaders = (hasBody = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  if (!hasBody) return headers;
  return headers;
};

async function refreshAccessToken() {
  if (!REFRESH_TOKEN) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: REFRESH_TOKEN }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access) setAuthToken(data.access);
    return true;
  } catch (e) {
    console.warn('Refresh token falhou:', e);
    return false;
  }
}

async function requestWithAuth(path, opts = {}) {
  const url = `${API_BASE_URL}${path}`;
  const method = opts.method || 'GET';
  const body = opts.body || null;

  const res = await fetch(url, {
    method,
    headers: defaultHeaders(!!body),
    body,
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retry = await fetch(url, {
        method,
        headers: defaultHeaders(!!body),
        body,
      });
      return handleResponse(retry);
    }
  }

  return handleResponse(res);
}

async function handleResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // Não é JSON
  }

  if (!res.ok) {
    const errMsg = (data && (data.detail || data.error)) || `HTTP ${res.status}`;
    const err = new Error(errMsg);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

// Notifications endpoints
export const registerDeviceToken = async (token, platform) => {
  return requestWithAuth('/api/mobile/notifications/register-token/', {
    method: 'POST',
    body: JSON.stringify({ token, platform }),
  });
};

export const unregisterDeviceToken = async (token) => {
  return requestWithAuth('/api/mobile/notifications/unregister-token/', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};
