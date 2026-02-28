import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/endpoints';
import { createStoredUser, AccessRole } from '../contracts';

const AuthContext = createContext(null);

const ROLE_ROUTES = {
  [AccessRole.ADMIN]: '/admin',
  [AccessRole.OPERATOR]: '/operator',
  [AccessRole.VIEWER]: '/viewer',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const loginResponse = await loginApi(email, password);
    const userData = createStoredUser(loginResponse);
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate(ROLE_ROUTES[loginResponse.role] || '/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
