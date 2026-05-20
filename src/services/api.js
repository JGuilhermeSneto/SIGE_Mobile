const API_BASE_URL = 'http://192.168.18.90:8000';

let AUTH_TOKEN = null;
let USER_INFO = null;

export const setAuthToken = (token) => {
  AUTH_TOKEN = token;
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
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/aluno/dashboard/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao carregar dados do painel.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    throw error;
  }
};

export const getBoletim = async () => {
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/aluno/boletim/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao carregar boletim.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar boletim:', error);
    throw error;
  }
};

export const getPerfil = async () => {
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/aluno/perfil/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao carregar perfil.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

export const putPerfil = async (dados) => {
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/aluno/perfil/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(dados),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao atualizar perfil.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

export const getRoteiro = async () => {
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/aluno/roteiro/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao carregar roteiro.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar roteiro:', error);
    throw error;
  }
};

export const getMateriais = async () => {
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/aluno/materiais/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao carregar materiais.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    throw error;
  }
};

export const getAtividades = async () => {
  try {
    if (!AUTH_TOKEN) {
      throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/academico/atividades/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Falha ao carregar atividades.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    throw error;
  }
};
