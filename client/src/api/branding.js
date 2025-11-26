import API from "./axios";

// GET /api/branding
export const getBranding = () => API.get("/branding");

// POST /api/branding/update  (body: settings object)
export const updateBranding = (settings) => API.post("/branding/update", settings);

// POST /api/branding/logo  (form-data: 'logo')
export const uploadLogo = (formData) =>
  API.post("/branding/logo", formData, { headers: { "Content-Type": "multipart/form-data" }});
