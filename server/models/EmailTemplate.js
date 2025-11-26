const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  html: { type: String, required: true },
  variables: [{ type: String }], // e.g. ["name","campaignName"]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);
