import API from "./axios";

// POST /api/queue/enqueue
export const enqueueEmail = (payload) => API.post("/queue/enqueue", payload);

// GET /api/queue
export const listQueue = (params) => API.get("/queue", { params });
