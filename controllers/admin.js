const { validationResult } = require("express-validator/check");
const mongodb = require("mongodb");
const Product = require("../models/product");

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
	// if (!req.session.isLoggedIn) {
	// 	return res.redirect("/login");
	// }
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
		hasError: false,
		errorMessage: null,

		// isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postAddProduct = (req, res, next) => {
	// console.log(req.body);
	// products.push({ title: req.body.title });
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Add Product",
			path: "/admin/edit-product",
			editing: false,
			hasError: true,
			product: {
				title: title,
				imageUrl: imageUrl,
				price: price,
				description: description,
			},
			errorMessage: errors.array()[0].msg,
		});
	}
	const product = new Product(
		{
			title: title,
			price: price,
			description: description,
			imageUrl: imageUrl,
			userId: req.user,
		}
		//mongoDb
		// title,
		// price,
		// description,
		// imageUrl,
		// null,
		// req.user._id
	);
	product
		.save()
		// req.user
		// 	.createProduct({
		// 		title: title,
		// 		price: price,
		// 		imageUrl: imageUrl,
		// 		description: description,
		// 		// userId: req.user.id, //manually setting the user id
		// 	})
		// Product.create()
		.then((result) => {
			// console.log(result);
			console.log("CREATED PRODUCT");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log(err);
		});
};

//responsible for fetching the product that should be edited and rendered
exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	//sql
	// req.user
	// 	.getProducts({ where: { id: prodId } })
	//Product.findByPk(prodId)
	Product.findById(prodId)
		.then((product) => {
			// const product = products[0];   sql
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product: product,
				hasError: false,
				errorMessage: null,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

//construct new product and replace / saving it to the databse
exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedDesc = req.body.description;
	const updatedImageUrl = req.body.imageUrl;

	// const product = new Product(
	// 	updatedTitle,
	// 	updatedPrice,
	// 	updatedDesc,
	// 	updatedImageUrl,
	// 	new ObjectId(prodId)
	// );
	// Product.findByPk(prodId)  sql version
	//mongoose
	Product.findById(prodId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect("/");
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			product.imageUrl = updatedImageUrl;
			return product.save().then((result) => {
				console.log("UPDATED PRODUCT");
				res.redirect("/admin/products");
			});
		})

		.catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
	// Product.fetchAll()
	Product.find({ userId: req.user._id }) //method for mongoose
		// req.user
		// 	.getProducts()
		// .select("title price -_id") //you can control which fields to be populated
		// .populate("userId", "name") //all the data in one step
		.then((products) => {
			console.log(products);
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
				// isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// destroy() method will delete the entry from the database
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	// Product.deleteById(prodId) //mongodb method
	// Product.findByIdAndRemove(prodId) //mongoose method
	Product.deleteOne({ _id: prodId, userId: req.user._id })

		// Product.findByPk(prodId)
		// 	.then((product) => {
		// 		return product.destroy();
		// 	})
		.then(() => {
			console.log("DESTROYED PRODUCT");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log(err);
		});
};
