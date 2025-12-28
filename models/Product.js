const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  images: [String],
  stock: { type: Number, default: 0 },
  history: [],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
