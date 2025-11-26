import API from "./axios";

// Get ALL audit logs (admin only)
export const getAllAuditLogs = () => API.get("/timeline/all");

// Get logs for specific item (campaign/user/template)
export const getAuditLogsFor = (targetType, targetId) =>
  API.get(`/timeline/${targetType}/${targetId}`);
