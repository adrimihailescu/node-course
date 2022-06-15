const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
// const Cart = require("../models/cart");
const Order = require("../models/order");
const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
	const page = +req.query.page || 1;

	let totalItems;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "Products",
				path: "/products",
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	//sequelize has the findById method as well but has been replaced by findByPk() in sequelize5
	//use findById for MongoDb
	Product.findById(prodId)
		.then((product) => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: product.title,
				path: "/products",
				// isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getIndex = (req, res, next) => {
	const page = +req.query.page || 1;
	//replacing fetchAll with findAll sequelize method
	//switch back to fetchAll for MOngoDb
	// Product.fetchAll()
	let totalItems;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
				// isAuthenticated: req.session.isLoggedIn,
				// csrfToken: req.csrfToken(),
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCart = (req, res, next) => {
	// console.log(req.user.cart);
	req.user
		// .getCart()
		.populate("cart.items.productId")
		// .execPopulate() doesn't work anymore in mongoose
		.then((user) => {
			// console.log(user.cart.items);
			const products = user.cart.items;
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products: products,
				// isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});

	// Cart.getCart((cart) => {
	// 	Product.fetchAll((products) => {
	// 		const cartProducts = [];
	// 		for (product of products) {
	// 			const cartProductData = cart.products.find(
	// 				(prod) => prod.id === product.id
	// 			);
	// 			if (cartProductData) {
	// 				cartProducts.push({ productData: product, qty: cartProductData.qty });
	// 			}
	// 		}
	//
	// 	});
	// });
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect("/cart");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
	// let fetchedCart;
	// let newQuantity = 1;
	// req.user
	// 	.getCart()
	// 	.then((cart) => {
	// 		fetchedCart = cart;
	// 		return cart.getProducts({ where: { id: prodId } });
	// 	})
	// 	.then((products) => {
	// 		let product;
	// 		if (products.length > 0) {
	// 			product = products[0];
	// 		}

	// 		if (product) {
	// 			const oldQuantity = product.cartItem.quantity;
	// 			newQuantity = oldQuantity + 1;
	// 			return product;
	// 		}
	// 		return Product.findByPk(prodId);
	// 	})
	// 	.then((product) => {
	// 		return fetchedCart.addProduct(product, {
	// 			through: { quantity: newQuantity },
	// 		});
	// 	})
	// 	.then(() => {
	// 		res.redirect("/cart");
	// 	})
	// 	.catch((err) => console.log(err));

	// Product.findById(prodId, (product) => {
	// 	Cart.addProduct(prodId, product.price);
	// });
	// res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate("cart.items.productId")
		// .execPopulate()
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					email: req.user.email,
					userId: req.user,
				},
				products: products,
			});
			return order.save();
		})

		// .getCart()
		// .then((cart) => {
		// 	fetchedCart = cart;
		// 	return cart.getProducts();
		// })
		// .then((products) => {
		// 	return req.user
		// 		.createOrder()
		// 		.then((order) => {
		// 			return order.addProducts(
		// 				products.map((product) => {
		// 					product.orderItem = { quantity: product.cartItem.quantity };
		// 					return product;
		// 				})
		// 			);
		// 		})
		// 		.catch((err) => console.log(err));
		// 	console.log(products);
		// })
		// .then((result) => {
		// 	return fetchedCart.setProducts(null);
		// })
		.then((result) => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect("/orders");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id })

		// .getOrders()
		.then((orders) => {
			// console.log(orders);
			res.render("shop/orders", {
				path: "/orders",
				pageTitle: "Your Orders",
				orders: orders,
				// isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		pageTitle: "Checkout",
	});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error("No order was found."));
			}
			//check if the currently logged in user has this order
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error("Unauthorized"));
			}
			const invoiceName = "invoice-" + orderId + ".pdf";
			const invoicePath = path.join("data", "invoices", invoiceName);

			//version for writing pdf files directly on the server
			const pdfDoc = new PDFDocument();
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				'inline; filename="' + invoiceName + '"'
			);
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);

			pdfDoc.fontSize(26).text("Invoice", {
				underline: true,
			});
			pdfDoc.text("---------------");
			let totalPrice = 0;
			order.products.forEach((prod) => {
				totalPrice += prod.quantity * prod.product.price;
				pdfDoc
					.fontSize(14)
					.text(
						prod.product.title +
							" - " +
							prod.quantity +
							" x " +
							"$" +
							prod.product.price
					);
			});
			pdfDoc.text("----");
			pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

			pdfDoc.end();
			//for small files - preloading data
			// 	fs.readFile(invoicePath, (err, data) => {
			// 		if (err) {
			// 			return next(err);
			// 		}
			// 		res.setHeader("Content-Type", "application/pdf");
			// 		res.setHeader(
			// 			"Content-Disposition",
			// 			'inline; filename="' + invoiceName + '"'
			// 		);
			// 		res.send(data);
			// 	});

			//with this, we stream data- for bigger files
			// const file = fs.createReadStream(invoicePath);
			// res.setHeader("Content-Type", "application/pdf");
			// res.setHeader(
			// 	"Content-Disposition",
			// 	'inline; filename="' + invoiceName + '"'
			// );
			// file.pipe(res);
		})
		.catch((err) => {
			console.log(err);
		});
};
