import API from "./axios";

// POST /api/auth/login
export const login = (email, password) => API.post("/auth/login", { email, password });

// POST /api/auth/change-password
// server expects { userId, newPassword }
export const changePassword = (userId, newPassword) =>
  API.post("/auth/change-password", { userId, newPassword });
