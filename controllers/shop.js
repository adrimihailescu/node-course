const Product = require("../models/product");
// const Cart = require("../models/cart");
// const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
	//replaced fetchAll with findAll sequelize method
	//changed back to fetchAll for MongoDb
	// Product.fetchAll()
	Product.find()
		.then((products) => {
			console.log(products);
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
			});
		})
		.catch((err) => console.log(err));
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
			});
		})
		.catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
	//replacing fetchAll with findAll sequelize method
	//switch back to fetchAll for MOngoDb
	// Product.fetchAll()
	Product.find()
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	// console.log(req.user.cart);
	req.user
		.getCart()

		.then((products) => {
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products: products,
			});
		})
		.catch((err) => console.log(err));

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
		.catch((err) => console.log(err));
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
		.deleteItemFromCart(prodId)
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.addOrder()
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
			res.redirect("/orders");
		})
		.catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then((orders) => {
			// console.log(orders);
			res.render("shop/orders", {
				path: "/orders",
				pageTitle: "Your Orders",
				orders: orders,
			});
		})
		.catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		pageTitle: "Checkout",
	});
};
