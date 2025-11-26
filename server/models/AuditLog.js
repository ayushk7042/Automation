// const mongoose = require("mongoose");

// const auditSchema = new mongoose.Schema({
//   action: { type: String, required: true },
//   actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   meta: { type: Object },
// }, { timestamps: true });

// module.exports = mongoose.model("AuditLog", auditSchema);
const mongoose = require('mongoose');
const auditSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  targetType: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  diff: { type: Object }, // { field: {old, new} }
  meta: { type: Object }
},{ timestamps: true });
module.exports = mongoose.model('AuditLog', auditSchema);
