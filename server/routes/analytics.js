// const express = require('express');
// const router = express.Router();
// const Campaign = require('../models/Campaign');
// const authMiddleware = require('../middleware/authMiddleware');

// // summary counts
// router.get('/summary', authMiddleware, async (req, res) => {
//   try {
//     // admin gets overall, AM sees their own
//     const baseFilter = {};
//     if (req.user.role === 'AM') baseFilter.amAssigned = req.user._id;

//     const total = await Campaign.countDocuments(baseFilter);
//     const pendingValidation = await Campaign.countDocuments({ ...baseFilter, validationStatus: 'Pending' });
//     const invoicesRaised = await Campaign.countDocuments({ ...baseFilter, invoiceStatus: 'Raised' });
//     const paymentsPending = await Campaign.countDocuments({ ...baseFilter, paymentStatus: 'NotReceived' });

//     res.json({ total, pendingValidation, invoicesRaised, paymentsPending });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const baseFilter = {};
    if (req.user.role === 'AM') baseFilter.amAssigned = req.user._id;

    const total = await Campaign.countDocuments(baseFilter);
    const pendingValidation = await Campaign.countDocuments({ ...baseFilter, validationStatus: 'Pending' });
    const invoicesRaised = await Campaign.countDocuments({ ...baseFilter, invoiceStatus: 'Raised' });
    const paymentsPending = await Campaign.countDocuments({ ...baseFilter, paymentStatus: 'NotReceived' });

    res.json({ total, pendingValidation, invoicesRaised, paymentsPending });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

// monthly invoice aggregation
router.get('/monthly-invoice', authMiddleware, async (req, res) => {
  try {
    const agg = await Campaign.aggregate([
      { $match: { invoiceDate: { $ne: null } } },
      { $group: { _id: { month: { $month: '$invoiceDate' }, year: { $year: '$invoiceDate' } }, total: { $sum: '$invoiceAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
