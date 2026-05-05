const mongoose = require("mongoose");
const { truncate } = require("node:fs/promises");

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  size: [sizeSchema],
  image: {
    type: [String],
  },
  gender: { type: String },

  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);