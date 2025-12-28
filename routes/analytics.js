const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Admin = require("../models/Admin");
const adminAuth = require("../middleware/adminAuth");

router.get("/stats", adminAuth, async (req, res) => {
  const products = await Product.countDocuments();
  const admins = await Admin.countDocuments();
  const stockAgg = await Product.aggregate([
    { $group: { _id: null, total: { $sum: "$stock" } } }
  ]);

  res.json({
    products,
    admins,
    stock: stockAgg[0]?.total || 0
  });
});

module.exports = router;
