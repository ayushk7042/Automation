const express = require('express');
const router = express.Router();
const EmailQueue = require('../models/EmailQueue');
const authMiddleware = require('../middleware/authMiddleware');
const writeAudit = require('../utils/audit');

// Enqueue email (Admin or campaign flow)
router.post('/enqueue', authMiddleware, async (req, res) => {
  try {
    const { to, subject, html, scheduledAt, campaignId } = req.body;
    if (!to || !subject || !html) return res.status(400).json({ message: 'Missing fields' });
    const item = await EmailQueue.create({
      to, subject, html, scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(), campaignId
    });
    await writeAudit('enqueue_email', req.user._id, { queueId: item._id, campaignId });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// list queued (admin)
router.get('/', authMiddleware, async (req, res) => {
  // admin can see all
  if (req.user.role === 'Admin') {
    const list = await EmailQueue.find().sort({ scheduledAt: -1 }).limit(200);
    return res.json(list);
  }
  // others only their queued emails by to
  const list = await EmailQueue.find({ to: req.user.email }).sort({ scheduledAt: -1 }).limit(200);
  res.json(list);
});

module.exports = router;
