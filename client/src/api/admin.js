// import API from "./axios";

// // POST /api/admin/create-user
// export const createUser = (payload) => API.post("/admin/create-user", payload);

// // GET /api/admin/users?role=AM
// export const listUsers = (params) => API.get("/admin/users", { params });

// // PATCH /api/admin/:id/activate
// export const activateUser = (id) => API.patch(`/admin/${id}/activate`);

// // PATCH /api/admin/:id/deactivate
// export const deactivateUser = (id) => API.patch(`/admin/${id}/deactivate`);

// // PATCH /api/admin/:id/reset-password  body { newPassword }
// export const resetUserPassword = (id, newPassword) =>
//   API.patch(`/admin/${id}/reset-password`, { newPassword });

// // DELETE /api/admin/:id
// export const deleteUser = (id) => API.delete(`/admin/${id}`);

// // 🔹 Get all users
// export const getUsers = async () => {
//   const res = await api.get("/admin/users");
//   return res.data;
// };

import API from "./axios";

// POST /api/admin/create-user
export const createUser = (payload) => API.post("/admin/create-user", payload);

// GET /api/admin/users?role=AM (optional params)
export const listUsers = (params) => API.get("/admin/users", { params });

// PATCH /api/admin/:id/activate
export const activateUser = (id) => API.patch(`/admin/${id}/activate`);

// PATCH /api/admin/:id/deactivate
export const deactivateUser = (id) => API.patch(`/admin/${id}/deactivate`);

// PATCH /api/admin/:id/reset-password
export const resetUserPassword = (id, newPassword) =>
  API.patch(`/admin/${id}/reset-password`, { newPassword });

// DELETE /api/admin/:id
export const deleteUser = (id) => API.delete(`/admin/${id}`);

// 🔹 FIXED — correct GET users
export const getUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};
