const mongodb = require("mongodb");
const Product = require("../models/product");

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
	// console.log("In another middleware!");
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	// console.log(req.body);
	// products.push({ title: req.body.title });
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(
		title,
		price,
		description,
		imageUrl,
		null,
		req.user._id
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

	const product = new Product(
		updatedTitle,
		updatedPrice,
		updatedDesc,
		updatedImageUrl,
		new ObjectId(prodId)
	);
	// Product.findByPk(prodId)  sql version
	// Product.findById(prodId)
	// 	.then((product) => {
	// 		product.title = updatedTitle;
	// 		product.price = updatedPrice;
	// 		product.description = updatedDesc;
	// 		product.imageUrl = updatedImageUrl;
	product
		.save()
		.then((result) => {
			console.log("UPDATED PRODUCT");
			res.redirect("/admin/products");
		})
		.catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		// req.user
		// 	.getProducts()
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// destroy() method will delete the entry from the database
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId)
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
