import apiClient from './api-client';

const TOKEN_KEY = 'contact_app_token';
const USER_KEY = 'user';

const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { username, password });

      // Accept either a plain string or an object with a token
      const token = typeof response.data === 'string'
        ? response.data
        : response.data?.token;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Extract claims from JWT (optional but useful for user info)
      let user = { username };
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = {
          username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || username,
          role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User',
          exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
        };
      } catch (e) {
        console.warn('Failed to decode JWT payload:', e);
      }

      // Store token and user
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      if (Date.now() >= expiration) {
        authService.logout(); // clear expired token
        return false;
      }
    } catch (e) {
      console.warn('Invalid token format');
      return false;
    }

    return true;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  initializeAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  }
};

authService.initializeAuth();

export default authService;
