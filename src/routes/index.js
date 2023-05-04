const productRoute = require("./product.route");
function route(app) {
  app.use("/v1/products", productRoute);
}
module.exports = route;
