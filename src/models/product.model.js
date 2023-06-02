const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  gmail: {
    type: String,
    require: true
  },
  price: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true
    }
  },
  link: {
    type: String,
    require: true
  },
  hasDone: {
    type: Boolean,
    require: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
});
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  prices: [
    {
      date: {
        type: Date,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  image: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
});

let Product = mongoose.model("Product", ProductSchema);
let Order = mongoose.model("Order", OrderSchema);
module.exports = { Product, Order };
