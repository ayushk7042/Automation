import API from "./axios";

// GET /api/timeline/:targetType/:targetId
export const fetchTimeline = (targetType, targetId) =>
  API.get(`/timeline/${encodeURIComponent(targetType)}/${encodeURIComponent(targetId)}`);
