const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const adminAuth = require("../middleware/adminAuth");
const role = require("../middleware/role");

const router = express.Router();

// Register Admin (Super-admin only)
router.post("/register", adminAuth, role("super-admin"), async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const admin = await Admin.create({
    email: req.body.email,
    password: hashed,
    role: req.body.role
  });
  res.json(admin);
});

// Login
router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(req.body.password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, email: admin.email, role: admin.role });
});

module.exports = router;
