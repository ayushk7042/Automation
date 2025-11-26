const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/authMiddleware');

const { requireAdmin } = require("../middleware/roleMiddleware");

router.get("/all", auth, requireAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(500);

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// router.get('/:targetType/:targetId', auth, async (req, res) => {
//   try {
//     const { targetType, targetId } = req.params;
//     const logs = await AuditLog.find({ targetType, targetId }).sort({ createdAt: -1 });
//     res.json(logs);
//   } catch (err) {
//     console.error(err); res.status(500).json({ message: 'Server error' });
//   }
// });


router.get('/:targetType/:targetId', auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    const logs = await AuditLog.find({ targetType, targetId })
      .populate("actor", "name email role") // ADD THIS
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
