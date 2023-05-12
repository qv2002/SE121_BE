const productRoute = require("./product.route");
const orderRoute = require("./order.route");
const productController = require('../controllers/product.controller');
function route(app) {
  app.use("/v1/products", productRoute);
  app.use("/v1/order", orderRoute);

  // Hàm cập nhật giá
  productController.scheduleCrawl();
}
module.exports = route;

