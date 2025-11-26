import API from "./axios";

// Upload invoice file for campaign
// POST /api/invoice/upload/:campaignId (form-data file field 'file')
export const uploadInvoice = (campaignId, formData) =>
  API.post(`/invoice/upload/${campaignId}`, formData, { headers: { "Content-Type": "multipart/form-data" }});


export const deleteInvoice = (docId) =>
  API.delete(`/invoice/delete/${docId}`);