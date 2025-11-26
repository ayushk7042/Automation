// const express = require('express');
// const router = express.Router();
// const EmailTemplate = require('../models/EmailTemplate');
// const authMiddleware = require('../middleware/authMiddleware');
// const { requireAdmin } = require('../middleware/roleMiddleware');
// const writeAudit = require('../utils/audit');

// // Create template (admin)
// router.post('/', authMiddleware, async (req, res) 
//  => {
//   try {
//     const { name, subject, html, variables } = req.body;
//     const t = await EmailTemplate.create({ name, subject, html, variables, createdBy: req.user._id });
//     await writeAudit('create_template', req.user._id, { templateId: t._id });
//     res.status(201).json(t);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // List templates
// router.get('/', authMiddleware, async (req, res) => {
//   const list = await EmailTemplate.find().sort({ createdAt: -1 });
//   res.json(list);
// });

// // Get template
// router.get('/:id', authMiddleware, async (req, res) => {
//   const t = await EmailTemplate.findById(req.params.id);
//   if (!t) return res.status(404).json({ message: 'Not found' });
//   res.json(t);
// });

// // Update (admin)
// router.patch('/:id', authMiddleware, requireAdmin, async (req, res) => {
//   const t = await EmailTemplate.findById(req.params.id);
//   if (!t) return res.status(404).json({ message: 'Not found' });
//   const { name, subject, html, variables } = req.body;
//   if (name) t.name = name;
//   if (subject) t.subject = subject;
//   if (html) t.html = html;
//   if (variables) t.variables = variables;
//   await t.save();
//   await writeAudit('update_template', req.user._id, { templateId: t._id });
//   res.json(t);
// });

// // Delete
// router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
//   await EmailTemplate.deleteOne({ _id: req.params.id });
//   await writeAudit('delete_template', req.user._id, { templateId: req.params.id });
//   res.json({ message: 'deleted' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const writeAudit = require('../utils/audit');


// ===============================
// CREATE TEMPLATE (ADMIN ONLY)
// ===============================
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, subject, html, variables } = req.body;

    const t = await EmailTemplate.create({
      name,
      subject,
      html,
      variables,
      createdBy: req.user._id
    });

    await writeAudit('create_template', req.user._id, 'EmailTemplate', t._id, {}, { name });

    res.status(201).json(t);
  } catch (err) {
    console.error("Create template error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===============================
// LIST ALL TEMPLATES
// ===============================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const list = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("List template error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===============================
// GET SINGLE TEMPLATE BY ID
// ===============================
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const t = await EmailTemplate.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });

    res.json(t);
  } catch (err) {
    console.error("Get template error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===============================
// UPDATE TEMPLATE (ADMIN ONLY)
// ===============================
router.patch('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const t = await EmailTemplate.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });

    const { name, subject, html, variables } = req.body;

    if (name !== undefined) t.name = name;
    if (subject !== undefined) t.subject = subject;
    if (html !== undefined) t.html = html;
    if (variables !== undefined) t.variables = variables;

    await t.save();

    await writeAudit('update_template', req.user._id, 'EmailTemplate', t._id, {}, {});

    res.json(t);
  } catch (err) {
    console.error("Update template error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===============================
// DELETE TEMPLATE (ADMIN ONLY)
// ===============================
router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    await EmailTemplate.deleteOne({ _id: req.params.id });

    await writeAudit('delete_template', req.user._id, 'EmailTemplate', req.params.id, {}, {});

    res.json({ message: 'deleted' });
  } catch (err) {
    console.error("Delete template error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
