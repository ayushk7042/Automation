const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  filename: String,
  path: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
}, 
 { timestamps: true }

);
module.exports = mongoose.model('InvoiceDoc', invoiceSchema);
