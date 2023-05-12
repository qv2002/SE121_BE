const express = require("express");
const route = express.Router();
const orderController = require("../controllers/order.controller");

route.delete("/:id", orderController.deleteOrder);
route.post("/create", orderController.createOrder);
route.get("/:id", orderController.getAnOrder);
route.get("/", orderController.getAllOrders);

module.exports = route;