import React, { createContext, useState, useEffect } from "react";
import * as authAPI from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // login(email, password) -> stores token + user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // changePassword(newPassword) -> uses stored user id
  const changePassword = async (newPassword) => {
    if (!user || !user.id) throw new Error("User not available");
    setLoading(true);
    try {
      const res = await authAPI.changePassword(user.id, newPassword);
      // after change, backend sets mustChangePassword=false
      // update local user
      const updatedUser = { ...user, mustChangePassword: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // optional: redirect from caller
  };

  // helper: refresh user from localStorage (useful if another tab updated)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          setUser(null);
        }
      }
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
