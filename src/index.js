const express = require("express");
const schedule = require("node-schedule");
const app = express();
const path = require("path");
const handlebars = require("express-handlebars")
require("dotenv").config();

const mongoose = require("mongoose");
const createError = require("http-errors");
const route = require("./routes");
const db = require("./config/db");
const cron = require("node-cron");
const productController = require("../src/controllers/product.controller");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//Template engine
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "resources", "views"));
app.get("/", (req, resp) => {
  resp.render("mail");
});

const PORT = process.env.PORT || 8000;

// connect mongodb
db.connect();

mongoose.connection.on("connected", function () {
  console.log(`Mongodb:: connected:::${this.name}`);
});

// THIS IS FAILED BECAUSE ARROW FUNCTION DOESN'T HAVE CONTEXT => CAN'T USE THIS.NAME
// connection.on('connected',()=>{
//     console.log(`Connected to db ${this.name}`);
// });

mongoose.connection.on("error", function (error) {
  console.log(`Mongodb:: error:::${JSON.stringify(error)}`);
});

mongoose.connection.on("disconnected", function () {
  console.log(`Mongodb:: disconnected:::${this.name}`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Route
route(app);

// try {
//   cron.schedule("0 * * * *", function () {
//     productController.updateEveryDay();
//   });
// } catch (error) {
//   console.log(error);
// }

// try {
//   cron.schedule("*/4 * * * *", function () {
//     productController.updateEveryDay();
//   });
// } catch (error) {
//   console.log(error);
// }



app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT ${PORT}`);
});
