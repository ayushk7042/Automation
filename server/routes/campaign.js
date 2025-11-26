

// // server/routes/campaign.js
// const express = require("express");
// const router = express.Router();
// const Campaign = require("../models/Campaign");
// const User = require("../models/User");
// const authMiddleware = require("../middleware/authMiddleware");
// const { requireAdmin } = require("../middleware/roleMiddleware");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const { Parser } = require("json2csv");
// const fs = require("fs");
// const path = require("path");

// // New helpers / models for added features
// const EmailQueue = require("../models/EmailQueue");
// const Notification = require("../models/Notification");
// const writeAudit = require("../utils/audit");

// // multer upload dir (for excel import)
// const upload = multer({ dest: "./uploads/" });

// // -------------------- CREATE CAMPAIGN (Admin or AM) --------------------
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { advertiserName, campaignName, amAssigned, startDate, endDate, overdueDate, platform,
//   durationType,
//   directType,
//   status,
//   transactions,
//   expectedBilling,
//   expectedSpend,
//   expectedMargin,
//   finalSpend,
//   margin,
//   marginPercentage,
//   invoiceNumber, notes } = req.body;

// // Auto duration logic
// let start = startDate ? new Date(startDate) : new Date();
// let autoEndDate = endDate ? new Date(endDate) : null;

// if (platform === "Mobile") {
//   autoEndDate = new Date(start);
//   autoEndDate.setDate(autoEndDate.getDate() + 15);
// }

// if (platform === "Web") {
//   autoEndDate = new Date(start);
//   if (durationType === "auto_30") autoEndDate.setDate(autoEndDate.getDate() + 30);
//   if (durationType === "auto_45") autoEndDate.setDate(autoEndDate.getDate() + 45);
// }

// if (platform === "Other") {
//   autoEndDate = endDate ? new Date(endDate) : null;
// }

//     if (!advertiserName || !campaignName)
//       return res.status(400).json({ message: "advertiserName & campaignName required" });

//     // AM can only create campaigns for themselves
//     let amId = amAssigned;
//     if (req.user.role === "AM") amId = req.user._id;

//     const campaign = new Campaign({
//       advertiserName,
//       campaignName,
//       amAssigned: amId,
     
// platform,
//   durationType,
//   directType,
//   status,
//   transactions,
//   expectedBilling,
//   expectedSpend,
//   expectedMargin,
//   finalSpend,
//   margin,
//   marginPercentage,
//   invoiceNumber,

//   startDate: start,
//   endDate: autoEndDate,

//       overdueDate: overdueDate ? new Date(overdueDate) : undefined,
//       notes,
//       createdBy: req.user._id,
//     });

//     await campaign.save();

//     // Audit log
//     try {
//       await writeAudit("campaign_create", req.user._id, "Campaign", campaign._id, {}, { advertiserName, campaignName });
//     } catch (e) {
//       console.error("audit error (create):", e);
//     }

//     res.status(201).json(campaign);
//   } catch (err) {
//     console.error("Create campaign error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------- UPDATE CAMPAIGN (Admin / AM / Finance limited fields) --------------------
// router.patch("/:id", authMiddleware, async (req, res) => {
//   try {
//     const c = await Campaign.findById(req.params.id);
//     if (!c) return res.status(404).json({ message: "Campaign not found" });

//     // AM can only update their assigned campaign
//     if (req.user.role === "AM" && (!c.amAssigned || !c.amAssigned.equals(req.user._id))) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     // Finance can update only payment fields
//     if (req.user.role === "Finance") {
//       const { paymentStatus, paymentReceivedDate, invoiceStatus, invoiceAmount, invoiceDate } = req.body;
//       const diff = {};
//       if (typeof invoiceStatus !== "undefined" && invoiceStatus !== c.invoiceStatus) {
//         diff.invoiceStatus = { old: c.invoiceStatus, new: invoiceStatus };
//         c.invoiceStatus = invoiceStatus;
//       }
//       if (typeof invoiceAmount !== "undefined" && invoiceAmount !== c.invoiceAmount) {
//         diff.invoiceAmount = { old: c.invoiceAmount, new: invoiceAmount };
//         c.invoiceAmount = invoiceAmount;
//       }
//       if (typeof invoiceDate !== "undefined") {
//         const nd = invoiceDate ? new Date(invoiceDate) : undefined;
//         diff.invoiceDate = { old: c.invoiceDate, new: nd };
//         c.invoiceDate = nd;
//       }
//       if (typeof paymentStatus !== "undefined" && paymentStatus !== c.paymentStatus) {
//         diff.paymentStatus = { old: c.paymentStatus, new: paymentStatus };
//         c.paymentStatus = paymentStatus;
//       }
//       if (typeof paymentReceivedDate !== "undefined") {
//         const nd = paymentReceivedDate ? new Date(paymentReceivedDate) : undefined;
//         diff.paymentReceivedDate = { old: c.paymentReceivedDate, new: nd };
//         c.paymentReceivedDate = nd;
//       }

//       await c.save();

//       // Audit
//       try {
//         await writeAudit("campaign_update_finance", req.user._id, "Campaign", c._id, diff, { financeUpdate: true });
//       } catch (e) {
//         console.error("audit error (finance update):", e);
//       }

//       // notify AM when payment received (optional)
//       if (req.body.paymentStatus === "Received" && c.amAssigned) {
//         try {
//           const am = await User.findById(c.amAssigned);
//           if (am) {
//             const html = `<p>Payment received for <b>${c.campaignName}</b>. Thank you.</p>`;
//             await EmailQueue.create({ to: am.email, subject: "Payment Received", html, campaignId: c._id, scheduledAt: new Date() });
//             await Notification.create({ user: am._id, title: "Payment received", body: `Payment received for ${c.campaignName}`, type: "payment", meta: { campaignId: c._id } });
//           }
//         } catch (e) {
//           console.error("notify AM after payment error", e);
//         }
//       }

//       return res.json(c);
//     }







//     // -------------------- General update (Admin or AM) --------------------
//     // Capture old values for diff
//     const old = c.toObject();

// // PLATFORM UPDATE LOGIC
// if (req.body.platform || req.body.startDate || req.body.durationType) {

//   const platform = req.body.platform || c.platform;
//   const type = req.body.durationType || c.durationType;
//   const start = new Date(req.body.startDate || c.startDate);
//   let end = c.endDate;

//   if (platform === "Mobile") {
//     end = new Date(start);
//     end.setDate(end.getDate() + 15);
//   }

//   if (platform === "Web") {
//     if (type === "auto_30") {
//       end = new Date(start);
//       end.setDate(end.getDate() + 30);
//     }
//     if (type === "auto_45") {
//       end = new Date(start);
//       end.setDate(end.getDate() + 45);
//     }
//   }

//   if (platform === "Other") {
//     end = req.body.endDate ? new Date(req.body.endDate) : c.endDate;
//   }

//   c.platform = platform;
//   c.durationType = type;
//   c.startDate = start;
//   c.endDate = end;
// }


//     const updatable = [
//       "advertiserName",
//       "campaignName",
//       "amAssigned",
// // NEW FIELDS
//   "platform",
//   "durationType",
//   "directType",
//   "status",
//   "transactions",
//   "expectedBilling",
//   "expectedSpend",
//   "expectedMargin",
//   "finalSpend",
//   "margin",
//   "marginPercentage",
//   "invoiceNumber",

//       "startDate",
//       "endDate",
//       "validationStatus",
//       "validatedAmount",
//       "invoiceStatus",
//       "invoiceAmount",
//       "invoiceDate",
//       "paymentStatus",
//       "paymentReceivedDate",
//       "overdueDate",
//       "notes",
//     ];

//     updatable.forEach((key) => {
//       if (typeof req.body[key] !== "undefined") {
//         if (key.endsWith("Date")) {
//           c[key] = req.body[key] ? new Date(req.body[key]) : undefined;
//         } else {
//           c[key] = req.body[key];
//         }
//       }
//     });

//     await c.save();

//     // Build diff object for audit
//     const diff = {};
//     updatable.forEach((key) => {
//       const oldVal = old[key] instanceof Date ? (old[key] ? new Date(old[key]).toISOString() : old[key]) : old[key];
//       const newVal = c[key] instanceof Date ? (c[key] ? new Date(c[key]).toISOString() : c[key]) : c[key];
//       if (String(oldVal) !== String(newVal)) {
//         diff[key] = { old: oldVal, new: newVal };
//       }
//     });

//     // Audit log
//     try {
//       await writeAudit("campaign_update", req.user._id, "Campaign", c._id, diff, { body: req.body });
//     } catch (e) {
//       console.error("audit error (update):", e);
//     }

//     // -------------------- ENQUEUE / NOTIFY on important status changes --------------------
//     // If validation became Received -> notify finance (via queue + DB notification)
//     try {
//       if (req.body.validationStatus === "Received") {
//         const finances = await User.find({ role: "Finance", status: "Active" });
//         const html = `<p>Validation received for <b>${c.campaignName}</b> by <b>${c.advertiserName}</b>. Please raise invoice for ₹${c.invoiceAmount || c.validatedAmount || 0}.</p>`;
//         for (const f of finances) {
//           await EmailQueue.create({ to: f.email, subject: "Validation Received – Invoice Required", html, campaignId: c._id, scheduledAt: new Date() });
//           await Notification.create({ user: f._id, title: "Validation received", body: `Validation received for ${c.campaignName}`, type: "validation", meta: { campaignId: c._id } });
//         }
//       }
//     } catch (e) {
//       console.error("enqueue finance email error", e);
//     }

//     // If invoice raised -> notify assigned AM (via queue + DB notification)
//     try {
//       if (req.body.invoiceStatus === "Raised") {
//         if (c.amAssigned) {
//           const am = await User.findById(c.amAssigned);
//           if (am) {
//             const html = `<p>Invoice raised for <b>${c.campaignName}</b>. Invoice Amount: ₹${c.invoiceAmount}</p>`;
//             await EmailQueue.create({ to: am.email, subject: "Invoice Raised", html, campaignId: c._id, scheduledAt: new Date() });
//             await Notification.create({ user: am._id, title: "Invoice Raised", body: `Invoice raised for ${c.campaignName}`, type: "invoice", meta: { campaignId: c._id } });
//           }
//         }
//       }
//     } catch (e) {
//       console.error("notify am invoice error", e);
//     }

//     // -------------------- Emit real-time update (socket.io) --------------------
//     try {
//       const io = req.app && req.app.locals && req.app.locals.io;
//       if (io) {
//         // Send minimal payload to save bandwidth; include full campaign if needed
//         io.emit("campaign.updated", { campaignId: c._id.toString(), campaign: c.toObject() });
//       }
//     } catch (e) {
//       console.error("socket emit error", e);
//     }

//     res.json(c);
//   } catch (err) {
//     console.error("Update campaign error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------- GET CAMPAIGNS WITH FILTERS --------------------
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const filter = {};
//     const { month, advertiser, amId, status } = req.query;

//     if (month) {
//       const m = parseInt(month, 10);
//       const year = new Date().getFullYear();
//       const start = new Date(year, m - 1, 1);
//       const end = new Date(year, m, 1);
//       filter.createdAt = { $gte: start, $lt: end };
//     }

//     if (advertiser) filter.advertiserName = { $regex: advertiser, $options: "i" };
//     if (amId) filter.amAssigned = amId;
//     if (status) {
//       filter.$or = [{ validationStatus: status }, { invoiceStatus: status }, { paymentStatus: status }];
//     }

//     if (req.user.role === "AM") filter.amAssigned = req.user._id;

//     const campaigns = await Campaign.find(filter)
//       .populate("amAssigned", "name email")
//       .populate("createdBy", "name email");

//     res.json(campaigns);
//   } catch (err) {
//     console.error("Get campaigns error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------- GET SINGLE CAMPAIGN --------------------
// // router.get("/:id", authMiddleware, async (req, res) => {
// //   try {
// //     const c = await Campaign.findById(req.params.id).populate("amAssigned", "name email");
// //     if (!c) return res.status(404).json({ message: "Campaign not found" });
// //     if (req.user.role === "AM" && (!c.amAssigned || !c.amAssigned.equals(req.user._id)))
// //       return res.status(403).json({ message: "Not allowed" });
// //     res.json(c);
// //   } catch (err) {
// //     console.error("Get campaign error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });
// // -------------------- GET SINGLE CAMPAIGN --------------------
// router.get("/:id", authMiddleware, async (req, res) => {
//   try {
//     const c = await Campaign.findById(req.params.id)
//       .populate("amAssigned", "name email")
//       .populate({
//         path: "invoiceDocs",
//         populate: { path: "uploadedBy", select: "name role" }
//       });

//     if (!c) return res.status(404).json({ message: "Campaign not found" });

//     if (req.user.role === "AM" && (!c.amAssigned || !c.amAssigned.equals(req.user._id)))
//       return res.status(403).json({ message: "Not allowed" });

//     res.json(c);
//   } catch (err) {
//     console.error("Get campaign error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // -------------------- IMPORT CAMPAIGNS VIA EXCEL/CSV (Admin only) --------------------
// router.post("/import", authMiddleware, requireAdmin, upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "File required" });

//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const created = [];
//     for (const row of data) {
//       const amUser = row.AMEmail ? await User.findOne({ email: row.AMEmail.toLowerCase() }) : null;
//       const campaign = new Campaign({
//         advertiserName: row.Advertiser || row.advertiserName || "",
//         campaignName: row.Campaign || row.campaignName || "",
//         amAssigned: amUser ? amUser._id : undefined,
//         startDate: row.StartDate ? new Date(row.StartDate) : undefined,
//         endDate: row.EndDate ? new Date(row.EndDate) : undefined,
//         overdueDate: row.OverdueDate ? new Date(row.OverdueDate) : undefined,
//         invoiceAmount: row.InvoiceAmount ? Number(row.InvoiceAmount) : 0,
//         createdBy: req.user._id,
//       });
//       await campaign.save();
//       created.push(campaign);

//       // audit per created row (light)
//       try {
//         await writeAudit("campaign_import_create", req.user._id, "Campaign", campaign._id, {}, { row });
//       } catch (e) {
//         console.error("audit error (import):", e);
//       }
//     }

//     // cleanup uploaded file
//     try {
//       fs.unlinkSync(req.file.path);
//     } catch (e) {
//       console.warn("could not cleanup temp upload:", e.message);
//     }

//     res.json({ message: "Imported", count: created.length, created });
//   } catch (err) {
//     console.error("Import campaigns error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------- EXPORT CAMPAIGNS AS CSV --------------------
// router.get("/export/csv", authMiddleware, async (req, res) => {
//   try {
//     const campaigns = await Campaign.find().populate("amAssigned", "name email");
//     const data = campaigns.map((c) => ({
//       advertiserName: c.advertiserName,
//       campaignName: c.campaignName,
//       amAssigned: c.amAssigned ? c.amAssigned.email : "",
//       startDate: c.startDate ? c.startDate.toISOString().slice(0, 10) : "",
//       endDate: c.endDate ? c.endDate.toISOString().slice(0, 10) : "",
//       validationStatus: c.validationStatus,
//       invoiceStatus: c.invoiceStatus,
//       invoiceAmount: c.invoiceAmount,
//       invoiceDate: c.invoiceDate ? c.invoiceDate.toISOString().slice(0, 10) : "",
//       paymentStatus: c.paymentStatus,
//       overdueDate: c.overdueDate ? c.overdueDate.toISOString().slice(0, 10) : "",
//     }));
//     const parser = new Parser();
//     const csv = parser.parse(data);
//     res.header("Content-Type", "text/csv");
//     res.attachment("campaigns.csv");
//     return res.send(csv);
//   } catch (err) {
//     console.error("Export CSV error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------- DELETE CAMPAIGN (Admin only) --------------------
// router.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
//   try {
//     const c = await Campaign.findById(req.params.id);
//     if (!c) return res.status(404).json({ message: "Campaign not found" });
//     await Campaign.deleteOne({ _id: req.params.id });
//     try {
//       await writeAudit("campaign_delete", req.user._id, "Campaign", req.params.id, {}, {});
//     } catch (e) {
//       console.error("audit error (delete):", e);
//     }
//     res.json({ message: "Campaign deleted" });
//   } catch (err) {
//     console.error("Delete campaign error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;






// server/routes/campaign.js
const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const multer = require("multer");
const xlsx = require("xlsx");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

// New helpers / models for added features
const EmailQueue = require("../models/EmailQueue");
const Notification = require("../models/Notification");
const writeAudit = require("../utils/audit");

// multer upload dir (for excel import)
const upload = multer({ dest: "./uploads/" });

// -------------------- CREATE CAMPAIGN (Admin or AM) --------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      advertiserName,
      campaignName,
      amAssigned,
      startDate,
      endDate,
      overdueDate,
      platform,
      durationType,
      directType,
      status,
      transactions,
      expectedBilling,
      expectedSpend,
      expectedMargin,
      finalSpend,
      margin,
      marginPercentage,
      invoiceNumber,
      notes,
    } = req.body;

    // required fields
    if (!advertiserName || !campaignName)
      return res
        .status(400)
        .json({ message: "advertiserName & campaignName required" });

    if (!platform)
      return res.status(400).json({ message: "platform required (Web|Mobile|Other)" });

    if (platform === "Web" && !durationType)
      return res
        .status(400)
        .json({ message: "durationType required for Web (auto_30|auto_45)" });

    // AM can only create campaigns for themselves
    let amId = amAssigned;
    if (req.user.role === "AM") amId = req.user._id;

    // Start date default to now if not provided
    const start = startDate ? new Date(startDate) : new Date();

    // Auto duration calculation
    let computedEnd = endDate ? new Date(endDate) : null;

    if (platform === "Mobile") {
      // Mobile -> fixed 15 days
      computedEnd = new Date(start);
      computedEnd.setDate(computedEnd.getDate() + 15);
    } else if (platform === "Web") {
      computedEnd = new Date(start);
      if (durationType === "auto_30") computedEnd.setDate(computedEnd.getDate() + 30);
      else if (durationType === "auto_45") computedEnd.setDate(computedEnd.getDate() + 45);
      else {
        // if durationType unknown, default to 30
        computedEnd.setDate(computedEnd.getDate() + 30);
      }
    } else {
      // Other -> allow provided endDate; if none, leave null
      computedEnd = endDate ? new Date(endDate) : undefined;
    }

    const campaign = new Campaign({
      advertiserName,
      campaignName,
      amAssigned: amId,
      platform,
      durationType: durationType || "custom",
      directType,
      status: status || "Live",
      transactions: transactions ? Number(transactions) : 0,
      expectedBilling: expectedBilling ? Number(expectedBilling) : 0,
      expectedSpend: expectedSpend ? Number(expectedSpend) : 0,
      expectedMargin: expectedMargin ? Number(expectedMargin) : 0,
      finalSpend: finalSpend ? Number(finalSpend) : 0,
      margin: margin ? Number(margin) : 0,
      marginPercentage: marginPercentage ? Number(marginPercentage) : 0,
      invoiceNumber,
      startDate: start,
      endDate: computedEnd,
      overdueDate: overdueDate ? new Date(overdueDate) : undefined,
      notes,
      createdBy: req.user._id,
    });

    await campaign.save();

    // Audit log
    try {
      await writeAudit(
        "campaign_create",
        req.user._id,
        "Campaign",
        campaign._id,
        {},
        { advertiserName, campaignName }
      );
    } catch (e) {
      console.error("audit error (create):", e);
    }

    res.status(201).json(campaign);
  } catch (err) {
    console.error("Create campaign error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- UPDATE CAMPAIGN (Admin / AM / Finance limited fields) --------------------
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Campaign not found" });

    // AM can only update their assigned campaign
    if (req.user.role === "AM" && (!c.amAssigned || !c.amAssigned.equals(req.user._id))) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Finance can update only payment fields
    if (req.user.role === "Finance") {
      const { paymentStatus, paymentReceivedDate, invoiceStatus, invoiceAmount, invoiceDate } = req.body;
      const diff = {};
      if (typeof invoiceStatus !== "undefined" && invoiceStatus !== c.invoiceStatus) {
        diff.invoiceStatus = { old: c.invoiceStatus, new: invoiceStatus };
        c.invoiceStatus = invoiceStatus;
      }
      if (typeof invoiceAmount !== "undefined" && invoiceAmount !== c.invoiceAmount) {
        diff.invoiceAmount = { old: c.invoiceAmount, new: invoiceAmount };
        c.invoiceAmount = invoiceAmount;
      }
      if (typeof invoiceDate !== "undefined") {
        const nd = invoiceDate ? new Date(invoiceDate) : undefined;
        diff.invoiceDate = { old: c.invoiceDate, new: nd };
        c.invoiceDate = nd;
      }
      if (typeof paymentStatus !== "undefined" && paymentStatus !== c.paymentStatus) {
        diff.paymentStatus = { old: c.paymentStatus, new: paymentStatus };
        c.paymentStatus = paymentStatus;
      }
      if (typeof paymentReceivedDate !== "undefined") {
        const nd = paymentReceivedDate ? new Date(paymentReceivedDate) : undefined;
        diff.paymentReceivedDate = { old: c.paymentReceivedDate, new: nd };
        c.paymentReceivedDate = nd;
      }

      await c.save();

      // Audit
      try {
        await writeAudit("campaign_update_finance", req.user._id, "Campaign", c._id, diff, { financeUpdate: true });
      } catch (e) {
        console.error("audit error (finance update):", e);
      }

      // notify AM when payment received (optional)
      if (req.body.paymentStatus === "Received" && c.amAssigned) {
        try {
          const am = await User.findById(c.amAssigned);
          if (am) {
            const html = `<p>Payment received for <b>${c.campaignName}</b>. Thank you.</p>`;
            await EmailQueue.create({ to: am.email, subject: "Payment Received", html, campaignId: c._id, scheduledAt: new Date() });
            await Notification.create({ user: am._id, title: "Payment received", body: `Payment received for ${c.campaignName}`, type: "payment", meta: { campaignId: c._id } });
          }
        } catch (e) {
          console.error("notify AM after payment error", e);
        }
      }

      return res.json(c);
    }

    // capture old BEFORE any modification for correct diff
    const old = c.toObject();

    // --- PLATFORM/DATE automatic logic (apply before finalizing updatable loop) ---
    // If platform/duration change is requested, compute new endDate automatically.
    if (req.body.platform || req.body.startDate || req.body.durationType) {
      const platform = req.body.platform || c.platform;
      const type = req.body.durationType || c.durationType;
      const start = req.body.startDate ? new Date(req.body.startDate) : (c.startDate ? new Date(c.startDate) : new Date());
      let end = c.endDate ? new Date(c.endDate) : undefined;

      if (platform === "Mobile") {
        end = new Date(start);
        end.setDate(end.getDate() + 15);
      } else if (platform === "Web") {
        end = new Date(start);
        if (type === "auto_30") end.setDate(end.getDate() + 30);
        else if (type === "auto_45") end.setDate(end.getDate() + 45);
        else end.setDate(end.getDate() + 30); // default 30 if unknown
      } else if (platform === "Other") {
        // allow provided endDate if passed; otherwise keep current
        end = req.body.endDate ? new Date(req.body.endDate) : c.endDate;
      }

      c.platform = platform;
      c.durationType = type;
      c.startDate = start;
      c.endDate = end;
    }

    // -------------------- General update (Admin or AM) --------------------
    // Include the new fields in the updatable list
    const updatable = [
      "advertiserName",
      "campaignName",
      "amAssigned",

      // NEW FIELDS
      "platform",
      "durationType",
      "directType",
      "status",
      "transactions",
      "expectedBilling",
      "expectedSpend",
      "expectedMargin",
      "finalSpend",
      "margin",
      "marginPercentage",
      "invoiceNumber",

      "startDate",
      "endDate",
      "validationStatus",
      "validatedAmount",
      "invoiceStatus",
      "invoiceAmount",
      "invoiceDate",
      "paymentStatus",
      "paymentReceivedDate",
      "overdueDate",
      "notes",
    ];

    // Prevent manual endDate overwrite in platform auto modes:
    if ((req.body.platform === "Mobile") || (req.body.platform === "Web") || (c.platform === "Mobile") || (c.platform === "Web")) {
      // For auto platforms, ignore manual endDate from req.body to preserve auto rules.
      if (req.body.endDate) delete req.body.endDate;
    }

    // updatable.forEach((key) => {
    //   if (typeof req.body[key] !== "undefined") {
    //     // parse numbers for numeric fields to avoid string persistence
    //     if (["transactions", "expectedBilling", "expectedSpend", "expectedMargin", "finalSpend", "margin", "marginPercentage", "invoiceAmount"].includes(key)) {
    //       c[key] = req.body[key] !== "" ? Number(req.body[key]) : 0;
    //     } else if (key.endsWith("Date") || key === "startDate" || key === "endDate" || key === "overdueDate" || key === "invoiceDate") {
    //       c[key] = req.body[key] ? new Date(req.body[key]) : undefined;
    //     } else {
    //       c[key] = req.body[key];
    //     }
    //   }
    // });


    updatable.forEach((key) => {
  if (typeof req.body[key] !== "undefined") {

    if (["transactions", "expectedBilling", "expectedSpend", "expectedMargin", "finalSpend", "margin", "marginPercentage", "invoiceAmount"].includes(key)) {
      let val = req.body[key];
      if (val === undefined || val === null || val === "" || isNaN(Number(val))) {
        c[key] = 0;
      } else {
        c[key] = Number(val);
      }
    } else if (key.endsWith("Date") || key === "startDate" || key === "endDate" || key === "overdueDate" || key === "invoiceDate") {
      c[key] = req.body[key] ? new Date(req.body[key]) : undefined;
    } else {
      c[key] = req.body[key];
    }
  }
});



    await c.save();

    // Build diff object for audit
    const diff = {};
    updatable.forEach((key) => {
      const oldVal = (old[key] instanceof Date) ? (old[key] ? new Date(old[key]).toISOString() : old[key]) : old[key];
      const newVal = (c[key] instanceof Date) ? (c[key] ? new Date(c[key]).toISOString() : c[key]) : c[key];
      if (String(oldVal) !== String(newVal)) {
        diff[key] = { old: oldVal, new: newVal };
      }
    });

    // Audit log
    try {
      await writeAudit("campaign_update", req.user._id, "Campaign", c._id, diff, { body: req.body });
    } catch (e) {
      console.error("audit error (update):", e);
    }

    // -------------------- ENQUEUE / NOTIFY on important status changes --------------------
    try {
      if (req.body.validationStatus === "Received") {
        const finances = await User.find({ role: "Finance", status: "Active" });
        const html = `<p>Validation received for <b>${c.campaignName}</b> by <b>${c.advertiserName}</b>. Please raise invoice for ₹${c.invoiceAmount || c.validatedAmount || 0}.</p>`;
        for (const f of finances) {
          await EmailQueue.create({ to: f.email, subject: "Validation Received – Invoice Required", html, campaignId: c._id, scheduledAt: new Date() });
          await Notification.create({ user: f._id, title: "Validation received", body: `Validation received for ${c.campaignName}`, type: "validation", meta: { campaignId: c._id } });
        }
      }

      if (req.body.invoiceStatus === "Raised") {
        if (c.amAssigned) {
          const am = await User.findById(c.amAssigned);
          if (am) {
            const html = `<p>Invoice raised for <b>${c.campaignName}</b>. Invoice Amount: ₹${c.invoiceAmount}</p>`;
            await EmailQueue.create({ to: am.email, subject: "Invoice Raised", html, campaignId: c._id, scheduledAt: new Date() });
            await Notification.create({ user: am._id, title: "Invoice Raised", body: `Invoice raised for ${c.campaignName}`, type: "invoice", meta: { campaignId: c._id } });
          }
        }
      }
    } catch (e) {
      console.error("enqueue/notify error", e);
    }

    // -------------------- Emit real-time update (socket.io) --------------------
    try {
      const io = req.app && req.app.locals && req.app.locals.io;
      if (io) {
        io.emit("campaign.updated", { campaignId: c._id.toString(), campaign: c.toObject() });
      }
    } catch (e) {
      console.error("socket emit error", e);
    }

    res.json(c);
  } catch (err) {
    console.error("Update campaign error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET CAMPAIGNS WITH FILTERS --------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};
    const { month, advertiser, amId, status } = req.query;

    if (month) {
      const m = parseInt(month, 10);
      const year = new Date().getFullYear();
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    if (advertiser) filter.advertiserName = { $regex: advertiser, $options: "i" };
    if (amId) filter.amAssigned = amId;
    if (status) {
      filter.$or = [{ validationStatus: status }, { invoiceStatus: status }, { paymentStatus: status }, { status }];
    }

    if (req.user.role === "AM") filter.amAssigned = req.user._id;

    const campaigns = await Campaign.find(filter)
      .populate("amAssigned", "name email")
      .populate("createdBy", "name email");

    res.json(campaigns);
  } catch (err) {
    console.error("Get campaigns error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET SINGLE CAMPAIGN --------------------
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id)
      .populate("amAssigned", "name email role")
      .populate({
        path: "invoiceDocs",
        populate: { path: "uploadedBy", select: "name role" }
      });

    if (!c) return res.status(404).json({ message: "Campaign not found" });

    if (req.user.role === "AM" && (!c.amAssigned || !c.amAssigned.equals(req.user._id)))
      return res.status(403).json({ message: "Not allowed" });

    res.json(c);
  } catch (err) {
    console.error("Get campaign error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- IMPORT CAMPAIGNS VIA EXCEL/CSV (Admin only) --------------------
router.post("/import", authMiddleware, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const created = [];
    for (const row of data) {
      const amUser = row.AMEmail ? await User.findOne({ email: row.AMEmail.toLowerCase() }) : null;

      // auto platform/duration support if present in CSV
      const platform = row.Platform || "Other";
      const durationType = row.DurationType || (platform === "Mobile" ? "auto_15" : (platform === "Web" ? "auto_30" : "custom"));
      const startDate = row.StartDate ? new Date(row.StartDate) : undefined;

      // compute endDate for mobile/web if no explicit end provided
      let computedEnd;
      if (platform === "Mobile" && startDate) {
        computedEnd = new Date(startDate); computedEnd.setDate(computedEnd.getDate() + 15);
      } else if (platform === "Web" && startDate) {
        computedEnd = new Date(startDate);
        if (durationType === "auto_45") computedEnd.setDate(computedEnd.getDate() + 45);
        else computedEnd.setDate(computedEnd.getDate() + 30);
      } else {
        computedEnd = row.EndDate ? new Date(row.EndDate) : undefined;
      }

      const campaign = new Campaign({
        advertiserName: row.Advertiser || row.advertiserName || "",
        campaignName: row.Campaign || row.campaignName || "",
        amAssigned: amUser ? amUser._id : undefined,
        platform,
        durationType,
        startDate: startDate,
        endDate: computedEnd,
        overdueDate: row.OverdueDate ? new Date(row.OverdueDate) : undefined,
        invoiceAmount: row.InvoiceAmount ? Number(row.InvoiceAmount) : 0,
        createdBy: req.user._id,
      });
      await campaign.save();
      created.push(campaign);

      // audit per created row (light)
      try {
        await writeAudit("campaign_import_create", req.user._id, "Campaign", campaign._id, {}, { row });
      } catch (e) {
        console.error("audit error (import):", e);
      }
    }

    // cleanup uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("could not cleanup temp upload:", e.message);
    }

    res.json({ message: "Imported", count: created.length, created });
  } catch (err) {
    console.error("Import campaigns error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- EXPORT CAMPAIGNS AS CSV --------------------
router.get("/export/csv", authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("amAssigned", "name email");
    const data = campaigns.map((c) => ({
      advertiserName: c.advertiserName,
      campaignName: c.campaignName,
      amAssigned: c.amAssigned ? c.amAssigned.email : "",
      platform: c.platform || "",
      durationType: c.durationType || "",
      startDate: c.startDate ? c.startDate.toISOString().slice(0, 10) : "",
      endDate: c.endDate ? c.endDate.toISOString().slice(0, 10) : "",
      validationStatus: c.validationStatus,
      invoiceStatus: c.invoiceStatus,
      invoiceAmount: c.invoiceAmount,
      invoiceDate: c.invoiceDate ? c.invoiceDate.toISOString().slice(0, 10) : "",
      paymentStatus: c.paymentStatus,
      overdueDate: c.overdueDate ? c.overdueDate.toISOString().slice(0, 10) : "",
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("campaigns.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Export CSV error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- DELETE CAMPAIGN (Admin only) --------------------
router.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Campaign not found" });
    await Campaign.deleteOne({ _id: req.params.id });
    try {
      await writeAudit("campaign_delete", req.user._id, "Campaign", req.params.id, {}, {});
    } catch (e) {
      console.error("audit error (delete):", e);
    }
    res.json({ message: "Campaign deleted" });
  } catch (err) {
    console.error("Delete campaign error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
