const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  gmail: {
    type: String,
  },
  price: {
    type: String,
  },
  link: {
    type: String,
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
        type: String,
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
