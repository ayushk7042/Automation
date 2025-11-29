import API from "./axios";

// Base: /api/campaigns

export const createCampaign = (payload) => API.post("/campaigns", payload);
export const updateCampaign = (id, payload) => API.patch(`/campaigns/${id}`, payload);
export const getCampaigns = (params) => API.get("/campaigns", { params });
export const getCampaign = (id) => API.get(`/campaigns/${id}`);
export const importCampaigns = (formData) =>
  API.post("/campaigns/upload", formData, { headers: { "Content-Type": "multipart/form-data" }});
export const exportCampaignsCSV = () => API.get("/campaigns/export/csv", { responseType: "blob" });
export const deleteCampaign = (id) => API.delete(`/campaigns/${id}`);
