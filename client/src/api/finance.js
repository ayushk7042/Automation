import API from "./axios";

// fetch all invoices
export const getInvoices = () => API.get("/finance/invoices");

// approve invoice
export const approveInvoice = (id) =>
  API.patch(`/finance/invoice/${id}/approve`);

// reject invoice
export const rejectInvoice = (id, reason) =>
  API.patch(`/finance/invoice/${id}/reject`, { reason });
