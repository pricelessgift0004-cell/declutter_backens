const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const adminAuth = require("../middleware/adminAuth");

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "declutter" }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", adminAuth, upload.array("images"), (req, res) => {
  const urls = req.files.map(f => f.path);
  res.json(urls);
});

module.exports = router;
