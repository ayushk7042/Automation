const mongoose = require("mongoose");

const emailQueueSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  html: { type: String, required: true },
  status: { type: String, enum: ['pending','sent','failed'], default: 'pending' },
  attempts: { type: Number, default: 0 },
  lastError: { type: String },
  scheduledAt: { type: Date, default: Date.now },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
}, { timestamps: true });

module.exports = mongoose.model("EmailQueue", emailQueueSchema);
