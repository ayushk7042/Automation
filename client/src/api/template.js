import API from "./axios";

// /api/templates
export const createTemplate = (payload) => API.post("/templates", payload);
export const listTemplates = (params) => API.get("/templates", { params });
export const getTemplate = (id) => API.get(`/templates/${id}`);
export const updateTemplate = (id, payload) => API.patch(`/templates/${id}`, payload);
export const deleteTemplate = (id) => API.delete(`/templates/${id}`);
