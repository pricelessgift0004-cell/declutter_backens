const express = require("express");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const log = require("../utils/log");

const router = express.Router();

// CREATE
router.post("/", adminAuth, async (req, res) => {
  const product = await Product.create(req.body);

  await log(req.admin.email, "Created product", product.name);

  res.json(product);
});

// READ (with search)
router.get("/", async (req, res) => {
  const q = req.query.search;
  const products = q
    ? await Product.find({ name: { $regex: q, $options: "i" } })
    : await Product.find();

  res.json(products);
});

// UPDATE
router.put("/:id", adminAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);

  product.history.push({
    admin: req.admin.email,
    change: `Updated product`,
    date: new Date()
  });

  Object.assign(product, req.body);

  await product.save();
  await log(req.admin.email, "Updated product", product.name);

  res.json(product);
});

// DELETE
router.delete("/:id", adminAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);

  await product.remove();
  await log(req.admin.email, "Deleted product", product.name);

  res.json({ message: "Deleted" });
});

module.exports = router;
