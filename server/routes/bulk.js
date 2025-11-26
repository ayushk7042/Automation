const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const auth = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const writeAudit = require('../utils/audit');

// Bulk update -- admin only
router.patch('/campaigns', auth, requireAdmin, async (req, res) => {
  try {
    const { ids, fields } = req.body; // ids: [], fields: {invoiceStatus: 'Raised' ...}
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'ids required' });
    const updated = await Campaign.updateMany({ _id: { $in: ids } }, { $set: fields });
    await writeAudit('bulk_update_campaigns', req.user._id, 'Campaign', null, { ids, fields });
    res.json({ message: 'updated', updated });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
