const express = require("express");
const route = express.Router();
const productController = require("../controllers/product.controller");

route.delete("/:id", productController.deleteProduct);
route.put("/:id", productController.updateAnProduct);
route.get("/:id", productController.getAnProduct);
route.post("/create", productController.createProduct);
route.get("/", productController.getAllProducts);

module.exports = route;
