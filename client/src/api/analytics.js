import API from "./axios";

// GET /api/analytics/summary
export const fetchSummary = () => API.get("/analytics/summary");

// GET /api/analytics/monthly-invoice
export const fetchMonthlyInvoice = () => API.get("/analytics/monthly-invoice");
