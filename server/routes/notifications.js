const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// get notifications
router.get('/', authMiddleware, async (req, res) => {
  const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(list);
});

// mark read
router.post('/:id/read', authMiddleware, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: 'ok' });
});

module.exports = router;
