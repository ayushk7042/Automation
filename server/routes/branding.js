const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: './uploads/' });

const SETTINGS_FILE = path.join(__dirname, '..', 'data', 'companySettings.json');

router.post('/update', authMiddleware, requireAdmin, async (req, res) => {
  const settings = req.body;
  if (!fs.existsSync(path.dirname(SETTINGS_FILE))) fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  res.json({ message: 'saved' });
});

router.post('/logo', authMiddleware, requireAdmin, upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'logo file required' });
  const dest = path.join('uploads', `company_logo_${Date.now()}${path.extname(req.file.originalname)}`);
  fs.renameSync(req.file.path, dest);
  const settings = fs.existsSync(SETTINGS_FILE) ? JSON.parse(fs.readFileSync(SETTINGS_FILE)) : {};
  settings.logo = dest;
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  res.json({ message: 'logo uploaded', logo: dest });
});

router.get('/', authMiddleware, async (req, res) => {
  const settings = fs.existsSync(SETTINGS_FILE) ? JSON.parse(fs.readFileSync(SETTINGS_FILE)) : {};
  res.json(settings);
});

module.exports = router;
