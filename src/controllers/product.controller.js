const Product = require("../models/product.model");
const axios = require("axios");
const cheerio = require("cheerio");

const ProductsController = {
  // [GET] /v1/products
  getAllProducts: async (req, res, next) => {
    Product.find({})
      .then((products) => res.json(products))
      .catch(next);
  },

  // [GET] /v1/products/:_id
  getAnProduct: async (req, res) => {
    try {
      const Anproduct = await Product.findById(req.params.id);
      res.status(200).json(Anproduct);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // [POST] /v1/product/create?link=....
  createProduct: async (req, res) => {
    try {
      const baseUrl = "https://phongvu.vn/iphone-14-pro--p459616?sku=220908992";
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
          price = price.trim();
          const newPrice = {
            date,
            price,
          };
          prices.push(newPrice);
        } else {
          price = info.find(".css-1co26wt > div").text().split("₫")[0].trim() + "₫";
          const newPrice = {
            date,
            price,
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
        res.status(200).json(savedProduct);
      } else if (baseUrl.split("/")[2] === "hoanghamobile.com") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const prices = [];
        const name = $(".top-product > h1").text().trim();
        const date = new Date();
        const price = $(".product-center > p > strong").text().split("₫")[0].trim() + "₫";
        const newPrice = {
          date,
          price,
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
        res.status(200).json(savedProduct);
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // [PUT /v1/product/:_id
  updateAnProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const baseUrl = product.link;
      if (baseUrl.split("/")[2] === "phongvu.vn") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const info = $(".css-6b3ezu");
        let price = info.find(".att-product-detail-latest-price").text();
        if (price !== "") {
          price = price.trim();
          const date = new Date();
          const newPrice = {
            date,
            price,
          };
          product.prices.push(newPrice);
          await product.save();
          res.status(200).json("update successfully");
        }
      } else if (baseUrl.split("/")[2] === "hoanghamobile.com") {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const price = $(".product-center > p > strong").text().split("₫")[0].trim();
        const date = new Date();
        const newPrice = {
          date,
          price,
        };
        product.prices.push(newPrice);
        await product.save();
        res.status(200).json("update successfully");
      }
    } catch (err) {
      res.status(500).json(err.message);
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
};

module.exports = ProductsController;
