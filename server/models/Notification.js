const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  body: String,
  type: String,
  read: { type: Boolean, default: false },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
