const productRoute = require("./product.route");
const orderRoute = require("./order.route");
function route(app) {
  app.use("/v1/products", productRoute);
  app.use("/v1/order", orderRoute);
}
module.exports = route;
