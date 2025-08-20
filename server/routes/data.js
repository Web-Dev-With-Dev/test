// routes/data.js
const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const DataSet = require("../models/DataSet");
const auth = require("../middleware/authMiddleware");
const {
  saveChartMeta,
  getDashboardData,
  getAllData
} = require("../controllers/dataController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload Excel file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.file.originalname.toLowerCase().endsWith(".xlsx")) {
      return res.status(400).json({ error: "Invalid file format" });
    }

    const wb = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

    console.log("📥 Processing file upload:", {
      filename: req.file.originalname,
      rows: rows.length,
      user: req.user.id
    });

    const saved = await DataSet.create({
      filename: req.file.originalname,
      uploadedBy: req.user.id,
      rows,
      chartType: null,
      dataset: { xAxis: null, yAxis: null, data: null }, // Always set dataset
      uploadedAt: new Date()
    });

    res.status(201).json({
      id: saved._id,
      filename: saved.filename,
      rowCount: rows.length,
      uploadedAt: saved.uploadedAt,
      dataset: saved.dataset,
      message: "File uploaded successfully"
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ✅ Public history page
router.get("/", getAllData);

// ✅ Chart meta & dashboard routes before /:id
router.post("/chart-meta", auth, saveChartMeta);
router.get("/dashboard", auth, getDashboardData);

// ✅ Fetch dataset by ID
router.get("/:id", auth, async (req, res) => {
  const data = await DataSet.findOne({
    _id: req.params.id,
    uploadedBy: req.user.id
  });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json(data);
});

module.exports = router;
