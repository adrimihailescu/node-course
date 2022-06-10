const path = require("path");

const express = require("express");
const { body } = require("express-validator");

// const rootDir = require("../util/path");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// const products = [];

//  /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// //  /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// //   /admin/add-product => POST
router.post(
	"/add-product",
	[
		body("title").isString().isLength({ min: 3 }).trim(),
		body("price").isFloat(),
		body("description").isLength({ min: 5, max: 400 }).trim(),
	],
	isAuth,
	adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
	"/edit-product",
	[
		body("title").isString().isLength({ min: 3 }).trim(),
		body("price").isFloat(),
		body("description").isLength({ min: 5, max: 400 }).trim(),
	],
	isAuth,
	adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
// exports.routes = router;
// exports.products = products;
