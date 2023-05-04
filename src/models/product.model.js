const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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
});

module.exports = mongoose.model("Product", ProductSchema);
