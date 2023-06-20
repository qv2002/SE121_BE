const { Product, Order } = require("../models/product.model");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const sendEmail = require("../utils/mailer");

const ProductsController = {
  // [GET] /v1/products
  getAllProducts: async (req, res) => {
    try {
      const allProduct = await Product.find();
      res.status(200).json(allProduct);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // [GET] /v1/products/:_id
  getAProduct: async (req, res) => {
    try {
      const Anproduct = await Product.findById(req.params.id);
      res.status(200).json(Anproduct);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // crawl data
  createProduct: async (link) => {
    try {
      let baseUrl = link;
      const response = await axios.get(baseUrl);
      if (baseUrl.split("/")[2] === "phongvu.vn") {
        const $ = cheerio.load(response.data);
        const prices = [];
        const image = $(".css-1dje825").find("img").attr("src");
        const info = $(".css-6b3ezu");
        const name = info
          .find("h1")
          .contents()
          .filter((i, el) => el.nodeType === 3)
          .text()
          .trim();

        const date = new Date();
        let price = info.find(".att-product-detail-latest-price").text();
        if (price !== "") {
          price = price.trim().split("₫")[0].replaceAll(".", "");
          const newPrice = {
            date,
            price: parseInt(price),
          };
          prices.push(newPrice);
        } else {
          price = info
            .find(".css-1co26wt > div")
            .text()
            .trim()
            .split("₫")[0]
            .replaceAll(".", "");
          const newPrice = {
            date,
            price: parseInt(price),
          };
          prices.push(newPrice);
        }
        const link = baseUrl;
        const productData = {
          name,
          prices,
          image,
          link,
        };

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        return savedProduct;
      }
      if (baseUrl.split("/")[2] === "gearvn.com") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const prices = [];
        const name = $(".product-name").text().trim();
        const date = new Date();
        const price = $(".pro-price")
          .text()
          .trim()
          .split("₫")[0]
          .replaceAll(".", "");
        const newPrice = {
          date,
          price: parseInt(price),
        };
        prices.push(newPrice);
        const image =  `https:${$(".boxlazy-img--aspect > img").attr("src")}`;
        const link = baseUrl;
        const productData = {
          name,
          prices,
          image,
          link,
        };
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        return savedProduct;
      } 
      if (baseUrl.split("/"[2] === "tiki.vn")) {
        const req = await axios.get(baseUrl);
        const prices = []
        const $ = cheerio.load(req.data);
        const name = $('.header > .title').text();
        let price = $('.product-price > .product-price__current-price')
          .text()
          .trim()
          .split('₫')[0]
          .replaceAll(".","");
        if (!price) {
            //console.log("sale");
            price = $(".flash-sale-price")
              .text()
              .trim()
              .split('₫')[0]
              .replaceAll(".","");  
            if (!price) {
                //console.log("discount")
                price = $(".styles__Price-sc-6hj7z9-1.jgbWJA")
                  .text()
                  .trim()
                  .split('₫')[0]
                  .replaceAll(".","");
            }
          }
        const image = $('.group-images').find('img').attr('srcset').split(" ")[0]
        const date = new Date();
        //console.log(price); 
        const newPrice = {
          date,
          price: parseInt(price),
        };
        prices.push(newPrice);
        const link = baseUrl;
        const productData = {
          name,
          prices,
          image,
          link,
        };
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        return savedProduct;          


      } else if (baseUrl.split("/")[2] === "hoanghamobile.com") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const prices = [];
        const name = $(".top-product > h1").text().trim();
        const date = new Date();
        const price = $(".product-center > p > strong")
          .text()
          .trim()
          .split("₫")[0]
          .replaceAll(",", "");
        const newPrice = {
          date,
          price: parseInt(price),
        };
        prices.push(newPrice);
        const image = $(".viewer > div > div > img").attr("src");
        const link = baseUrl;
        const productData = {
          name,
          prices,
          image,
          link,
        };
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        return savedProduct;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // [PUT /v1/product/:_id
  updateAProduct: async (id) => {
    try {
      // const product = await Product.findById(req.params.id);
      const product = await Product.findById(id);
      const baseUrl = product.link;
      const currentTime = new Date();
      //console.log(`currentTime: ${currentTime}`);
      const latestPriceTime = product.prices[product.prices.length - 1].date;
      //console.log(`latestPriceTime: ${latestPriceTime}`);
      if(currentTime - latestPriceTime > 60000) {
        let newPrice = {};
        if (baseUrl.split("/")[2] === "phongvu.vn") {
          const response = await axios.get(baseUrl);
          const $ = cheerio.load(response.data);
          const info = $(".css-6b3ezu");
          let price = info.find(".att-product-detail-latest-price").text();
          if (price !== "") {
            price = price.trim().split("₫")[0].replaceAll(".", "");
            const date = new Date();
            newPrice = {
              date,
              price: parseInt(price),
            };
          } else {
            price = info
              .find(".css-1co26wt > div")
              .text()
              .trim()
              .split("₫")[0]
              .replaceAll(".", "");
            const date = new Date();
            newPrice = {
              date,
              price: parseInt(price),
            };
          }
        }
        if (baseUrl.split("/")[2] === "gearvn.com") {
          const response = await axios.get(baseUrl);
          const $ = cheerio.load(response.data);
          const price = $(".pro-price")
            .text()
            .trim()
            .split("₫")[0]
            .replaceAll(".", "");
          const date = new Date();
          newPrice = {
            date,
            price: parseInt(price),
          };
        }
        if (baseUrl.split("/")[2] === "tiki.vn") {
          const response = await axios.get(baseUrl);
          const $ = cheerio.load(response.data);
          let price = $('.product-price > .product-price__current-price')
            .text()
            .trim()
            .split('₫')[0]
            .replaceAll(".","");
          if (!price) {
              //console.log("sale");
              price = $(".flash-sale-price")
                .text()
                .trim()
                .split('₫')[0]
                .replaceAll(".","");  
              if (!price) {
                  //console.log("discount")
                  price = $(".styles__Price-sc-6hj7z9-1.jgbWJA")
                    .text()
                    .trim()
                    .split('₫')[0]
                    .replaceAll(".","");
              }
            }
          const date = new Date();
          newPrice = {
            date,
            price: parseInt(price),
          };
        } else if (baseUrl.split("/")[2] === "hoanghamobile.com") {
          const response = await axios.get(baseUrl);
          const $ = cheerio.load(response.data);
          const price = $(".product-center > p > strong")
            .text()
            .trim()
            .split("₫")[0]
            .replaceAll(",", "");
          const date = new Date();
          newPrice = {
            date,
            price: parseInt(price),
          };
        }
        if (Object.keys(newPrice).length !== 0) {
          product.prices.push(newPrice);
          await product.save();
        } else {
          console.log("empty object");
        } 
      } else {
        console.log("Product  is updated");
      }
      return product;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // [DELETE] /v1/product/:id
  deleteProduct: async (req, res) => {
    try {
      const product = req.params.id;
      await Product.findByIdAndDelete(product);
      await Order.findByIdAndDelete(product.order)
      res.status(200).json("delete successfully");
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // Update price của từng sản phẩm có trong list
  updateEveryTime: async () => {
    try {
      let updateProduct;
      const order = await Order.find().populate("product");
      for (let i = 0; i < order.length; i++) {
        if (!order[i].hasDone)
        {
          const product = order[i].product;
          updateProduct = await ProductsController.updateAProduct(product.id);
          const updatedProduct = await Product.findById(product.id).populate(
            "prices"
          );
          const updatePrice =
            updatedProduct.prices[updatedProduct.prices.length - 1].price;
          console.log(`Update price: ${updatePrice}`);
          let min = order[i].price.min;
          let max = order[i].price.max;
          if (updatePrice > min && updatePrice < max) {
            console.log(`${min} < price: ${updatePrice} < ${max}`);
            // mail and delete product
            //console.log(order[i].product.image);
            const options = { 
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }
            const formattedPrice = updatePrice.toLocaleString('vi-VN', options);

            await sendEmail({
              reciverEmail: order[i].gmail,
              product_name: order[i].product.name,
              product_price: formattedPrice,
              link_image: order[i].product.image,
              product_link: order[i].link,
            });
            // delete product hasDone: true;
            order[i].hasDone = true;
            await order[i].save();
          } else {
            console.log(`price: ${updatePrice} min:${min} max:${max}`);
          }
        }
        else {
          updateProduct = "email sent";
        }
        console.log(updateProduct);
      }
      return updateProduct;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // [GET] /v1/products/:name/month=:month/year=:year
  getPricesInMonth: async (req, res) => {
    try {
      const productName = req.params.productname;
      const month = req.params.month;
      const year = req.params.year;

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 1);
      console.log(startOfMonth);
      console.log(endOfMonth);

      const product = await Product.findOne({ name: productName }).exec();
      //const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product is not found' });
        return;
      }
  
      const pricesInMonth = product.prices.filter(
        (price) => {
          if (price.date >= startOfMonth && price.date <= endOfMonth) {
            return price;
          }
        }
      );
      res.status(200).json(pricesInMonth);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  // [PUT] /v1/products/crawltime
  setTimeCrawl: async (req, res) => {
    try {
      ProductsController.updateEveryTime();
      res.status(200).json("Set time crawl successfully");
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  scheduleCrawl: async (req, res) => {
    try {
      cron.schedule("3 0 * * *", function () {
        ProductsController.updateEveryTime();
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = ProductsController;
