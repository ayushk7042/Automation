import API from "./axios";

// PATCH /api/bulk/campaigns  body: { ids: [], fields: {} }
export const bulkUpdateCampaigns = (ids, fields) =>
  API.patch("/bulk/campaigns", { ids, fields });
