const { Product, Order } = require("../models/product.model");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

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
          price = price.trim().split("₫")[0].replaceAll(".","");
          const newPrice = {
            date,
            price: parseInt(price),
          };
          prices.push(newPrice);
        } else {
          price = info.find(".css-1co26wt > div").text().trim().split("₫")[0].replaceAll(".","");
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
      if (baseUrl.split("/")[2] === "gearvn.com"){
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const prices = [];
        const name = $(".product_name").text().trim();
        const date = new Date();
        const price = $(".product_sale_price").text().trim().split("₫")[0].replaceAll(",","");
        const newPrice = {
          date,
          price: parseInt(price),
        };
        prices.push(newPrice);
        const image = $(".fotorama > img").attr("src")
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
        const price = $(".product-center > p > strong").text().trim().split("₫")[0].replaceAll(",","");
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
      let newPrice = {}
      if (baseUrl.split("/")[2] === "phongvu.vn") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const info = $(".css-6b3ezu");
        let price = info.find(".att-product-detail-latest-price").text();
        if (price !== "") {
          price = price.trim().split("₫")[0].replaceAll(".","");
          const date = new Date();
          newPrice = {
            date,
            price: parseInt(price),
          };
        } else {
          price = info.find(".css-1co26wt > div").text().trim().split("₫")[0].replaceAll(".","");
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
        const price = $(".product_sale_price").text().trim().split("₫")[0].replaceAll(",","");
        const date = new Date();
        newPrice = {
          date,
          price: parseInt(price),
        };
      } else if (baseUrl.split("/")[2] === "hoanghamobile.com") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const price = $(".product-center > p > strong").text().trim().split("₫")[0].replaceAll(",","");
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
        console.log('empty object');
      }
      return product;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // [DELETE] /v1/product/:id
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
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
        const product = order[i].product;
        updateProduct = await ProductsController.updateAProduct(product.id);
        const updatedProduct = await Product.findById(product.id).populate("prices");
        const updatePrice = updatedProduct.prices[updatedProduct.prices.length - 1].price;
        console.log(`Update price: ${updatePrice}`);
        let min = order[i].price.min;
        let max = order[i].price.max;
        if (updatePrice > min && updatePrice < max) {
          console.log(`${min} < price: ${updatePrice} < ${max}`);
          // mail and delete product
        } else {
          console.log(`price: ${updatePrice} min:${min} max:${max}`);
        }
        console.log(updateProduct);
      }
      return updateProduct;
    } catch (err) {
      throw new Error(err.message);
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
      cron.schedule("*/1 * * * *", function () {
        ProductsController.updateEveryTime();
      });
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
};

module.exports = ProductsController;
