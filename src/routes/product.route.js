const express = require("express");
const route = express.Router();
const productController = require("../controllers/product.controller");

//route.get("/:id/month=:month/year=:year", productController.getPricesInMonth);
route.get("/:productname/month=:month/year=:year", productController.getPricesInMonth);
route.put("/update", productController.updateEveryTime);
route.put("/crawltime", productController.setTimeCrawl);
route.delete("/:id", productController.deleteProduct);
route.get("/:id", productController.getAProduct);
route.get("/", productController.getAllProducts);

module.exports = route;