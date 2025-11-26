// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const auth = require('../middleware/authMiddleware');
// const { requireAdmin } = require('../middleware/roleMiddleware');
// const InvoiceDoc = require('../models/InvoiceDoc');
// const Campaign = require('../models/Campaign');

// const upload = multer({ dest: './uploads/invoices/' });

// // router.post('/upload/:campaignId', auth, upload.single('file'), async (req, res) => {
// //   try {
// //     const { campaignId } = req.params;
// //     if (!req.file) return res.status(400).json({ message: 'File required' });
// //     const destDir = path.join('uploads','invoices');
// //     if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
// //     const destName = `invoice_${campaignId}_${Date.now()}${path.extname(req.file.originalname)}`;
// //     const destPath = path.join(destDir, destName);
// //     fs.renameSync(req.file.path, destPath);

// //     const doc = await InvoiceDoc.create({ campaign: campaignId, filename: destName, path: destPath, uploadedBy: req.user._id });
// //     // attach to campaign (optional)
// //     //await Campaign.findByIdAndUpdate(campaignId, { $set: { invoiceDoc: doc._id } });

// //     await Campaign.findByIdAndUpdate(campaignId, {
// //   $push: { invoiceDocs: doc._id }
// // });


// //     res.json({ message: 'uploaded', doc });
// //   } catch (err) {
// //     console.error(err); res.status(500).json({ message: 'Server error' });
// //   }
// // });

// router.post('/upload/:campaignId', auth, upload.single('file'), async (req, res) => {
//   try {
//     const { campaignId } = req.params;

//     if (!req.file) return res.status(400).json({ message: "File required" });

//     const destDir = path.join("uploads", "invoices");
//     if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

//     const destName = `file_${campaignId}_${Date.now()}${path.extname(req.file.originalname)}`;
//     const destPath = path.join(destDir, destName);

//     fs.renameSync(req.file.path, destPath);

//     const doc = await InvoiceDoc.create({
//       campaign: campaignId,
//       filename: req.file.originalname,
//       path: destPath,

//        path: `uploads/invoices/${destName}`,
//       uploadedBy: req.user._id,
//     });

//     // Push into campaign docs
//     await Campaign.findByIdAndUpdate(campaignId, {
//       $push: { invoiceDocs: doc._id }
//     });

//     res.json({ message: "uploaded", doc });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });



// // router.delete("/delete/:docId", auth, async (req, res) => {
// //   try {
// //     const { docId } = req.params;

// //     const doc = await InvoiceDoc.findById(docId);
// //     if (!doc) return res.status(404).json({ message: "Not found" });

// //     // Delete file from folder
// //     if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);

// //     // Remove from campaign
// //     await Campaign.findByIdAndUpdate(doc.campaign, {
// //       $pull: { invoiceDocs: docId }
// //     });

// //     await InvoiceDoc.findByIdAndDelete(docId);

// //     res.json({ message: "deleted" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Delete failed" });
// //   }
// // });
// router.delete("/delete/:id", auth, async (req, res) => {
//   try {
//     const { docId } = req.params;

//     const doc = await InvoiceDoc.findById(docId).populate("uploadedBy", "name role");
//     if (!doc) return res.status(404).json({ message: "File not found" });

//     // Delete file from filesystem
//     if (fs.existsSync(doc.path)) {
//       fs.unlinkSync(doc.path);
//     }

//     // Delete DB record
//     await InvoiceDoc.findByIdAndDelete(docId);

//     // Remove from campaign.invoiceDocs array
//     await Campaign.updateOne(
//       { _id: doc.campaign },
//       { $pull: { invoiceDocs: docId } }
//     );

//     // Add to timeline
//     req.app.locals.io.emit("timelineUpdate", {
//       campaign: doc.campaign,
//       action: "File Deleted",
//       actor: req.user._id,
//       meta: { filename: doc.filename }
//     });

//     res.json({ message: "Deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/authMiddleware");

const InvoiceDoc = require("../models/InvoiceDoc");
const Campaign = require("../models/Campaign");

const upload = multer({ dest: "./uploads/invoices/" });

// ------------------ UPLOAD FILE ------------------
router.post("/upload/:campaignId", auth, upload.single("file"), async (req, res) => {
  try {
    const { campaignId } = req.params;
    if (!req.file) return res.status(400).json({ message: "File required" });

    const destDir = path.join("uploads", "invoices");
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const storedName = `file_${campaignId}_${Date.now()}${path.extname(req.file.originalname)}`;
    const finalPath = path.join(destDir, storedName);

    fs.renameSync(req.file.path, finalPath);

    // SAVE WITH CLEAN PUBLIC PATH
    const doc = await InvoiceDoc.create({
      campaign: campaignId,
      filename: req.file.originalname,
      storedName: storedName,
      path: `uploads/invoices/${storedName}`,
      uploadedBy: req.user._id,
    });

    await Campaign.findByIdAndUpdate(campaignId, {
      $push: { invoiceDocs: doc._id }
    });

    res.json({ message: "uploaded", doc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});


// ------------------ DELETE FILE ------------------
// router.delete("/delete/:docId", auth, async (req, res) => {
//   try {
//     const { docId } = req.params;

//     const doc = await InvoiceDoc.findById(docId);
//     if (!doc) return res.status(404).json({ message: "Not found" });

//     // ABSOLUTE FILE PATH
//     const absolutePath = path.join(__dirname, "..", doc.path);

//     if (fs.existsSync(absolutePath)) {
//       fs.unlinkSync(absolutePath);
//     }

//     await Campaign.findByIdAndUpdate(doc.campaign, {
//       $pull: { invoiceDocs: docId }
//     });

//     await InvoiceDoc.findByIdAndDelete(docId);

//     res.json({ message: "deleted" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// });


router.delete("/delete/:docId", auth, async (req, res) => {
  try {
    const { docId } = req.params;

    const doc = await InvoiceDoc.findById(docId);
    if (!doc) return res.status(404).json({ message: "Not found" });

    const absolutePath = path.join(__dirname, "..", doc.path);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await Campaign.updateOne(
      { _id: doc.campaign },
      { $pull: { invoiceDocs: docId } }
    );

    await InvoiceDoc.findByIdAndDelete(docId);

    res.json({ message: "Deleted" });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;
