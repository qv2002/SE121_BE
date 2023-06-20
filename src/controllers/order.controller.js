const { Product, Order } = require("../models/product.model");
const ProductsController = require("./product.controller");

const OrderController = {
  // [GET ALL] /v1/order
  getAllOrders: async (req, res) => {
    try {
      const allOrder = await Order.find();
      res.status(200).json(allOrder);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // [GET ONE] /v1/order/:id
  getAnOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("product");
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  // [POST] /v1/order/create
  createOrder: async (req, res) => {
    try {
      const { link, gmail, price } = req.body;
      if (!link || !gmail || !price ) throw new Error('Please provide link, gmail and price (min, max)!')
      const baseUrl = link.split("/")[2];
      //console.log(baseUrl);
      if (baseUrl !== "phongvu.vn" && baseUrl !=="gearvn.com" && baseUrl !== "tiki.vn" && baseUrl !== "hoanghamobile.com") throw new Error('this link should be contain "phongvu.vn", "gearvn.com", "tiki.vn", "hoanghamobile.com"')
      const isExists = await Order.findOne({ link }).exec();
      let createdProduct = "a";
      if (isExists) {
        // createdProduct = await productController.createProduct(link);
        createdProduct = await ProductsController.updateAProduct(isExists.product);
      }
      else {
        createdProduct = await ProductsController.createProduct(link);
      }
      const newOrder = new Order({
        gmail: gmail,
        price: price,
        link: link,
        product: createdProduct,
        hasDone: false,
      });
      
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // [DELETE] /v1/order/:id
  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      await Product.findByIdAndDelete(order.product);
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json("delete successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = OrderController;