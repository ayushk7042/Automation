const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const InvoiceDoc = require("../models/InvoiceDoc");
const writeAudit = require("../utils/audit");

// 🔹 GET ALL invoices (Finance only)
router.get("/invoices", authMiddleware, async (req, res) => {
  try {
    // Finance + Admin dono invoices dekh sakte
    const list = await InvoiceDoc.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 APPROVE invoice (Finance only)
router.patch("/invoice/:id/approve", authMiddleware, async (req, res) => {
  try {
    const inv = await InvoiceDoc.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: "Not found" });

    inv.status = "Approved";
    inv.rejectReason = "";
    await inv.save();

    await writeAudit("invoice_approved", req.user._id, { invoiceId: inv._id });

    res.json({ message: "Approved", inv });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 REJECT invoice (Finance)
router.patch("/invoice/:id/reject", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Reason required" });

    const inv = await InvoiceDoc.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: "Not found" });

    inv.status = "Rejected";
    inv.rejectReason = reason;
    await inv.save();

    await writeAudit("invoice_rejected", req.user._id, {
      invoiceId: inv._id,
      reason,
    });

    res.json({ message: "Rejected", inv });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
