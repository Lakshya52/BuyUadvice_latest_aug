import React, { createContext, useState, useContext, useEffect } from 'react';
import LoginModal from '../components/LoginModal';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('auth_success') || params.has('auth_error')) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    fetch('/backend/auth/check.php', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.authenticated) {
          setUser(data.user);
          setHasPassword(data.has_password);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (userData, closeModal = true, userHasPassword = true) => {
    setUser(userData);
    setHasPassword(userHasPassword);
    if (closeModal) closeLogin();
  };

  const logout = async () => {
      await fetch('/backend/auth/logout.php', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoginOpen, openLogin, closeLogin, user, loginUser, logout, loading, hasPassword, setHasPassword }}>
      {children}
      <LoginModal />
    </AuthContext.Provider>
  );
};
