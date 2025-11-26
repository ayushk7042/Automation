import API from "./axios";

// GET /api/notifications
export const fetchNotifications = () => API.get("/notifications");

// POST /api/notifications/:id/read
export const markNotificationRead = (id) => API.post(`/notifications/${id}/read`);
