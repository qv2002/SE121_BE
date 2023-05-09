const express = require("express");
const route = express.Router();
const productController = require("../controllers/product.controller");

route.delete("/:id", productController.deleteProduct);
route.put("/:id", productController.updateAProduct);
route.get("/id", productController.getAProduct);
route.get("/", productController.getAllProducts);

module.exports = route;
