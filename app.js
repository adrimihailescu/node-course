const path = require("path");

const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");

const mongoose = require("mongoose");
const session = require("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");
//mongoDb
// const mongoConnect = require("./util/database").mongoConnect;
// const User = require("./models/user");

//sequelize
// const sequelize = require("./util/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express();

// app.engine(
// 	"hbs",
// 	expressHbs({
// 		layoutsDir: "views/layouts/",
// 		defaultLayout: "main-layout",
// 		extname: "hbs",
// 	})
// );
app.set("view engine", "ejs");
app.set("views", "views");

//routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// db.execute("SELECT * FROM products")
// 	.then((result) => {
// 		console.log(result[0], result[1]);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({ secret: "my secret", resave: false, saveUninitialised: false })
);

//mongoDb
app.use((req, res, next) => {
	//sequelize setup is with findByPk()
	User.findById("6290ce5b5172d69a5fe24990")
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

//routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//sequelize setup for sql
//with this sequelize will define the relations/associations and create tables
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
// 	// .sync({ force: true })
// 	.sync()
// 	.then((result) => {
// 		return User.findByPk(1);
// 	})
// 	.then((user) => {
// 		//check if i dont have a user then i call create method to create one
// 		if (!user) {
// 			return User.create({ name: "Adriana", email: "test@test.com" });
// 		}
// 		return user;
// 	})
// 	.then((user) => {
// 		// console.log(user);
// 		return user.createCart();
// 	})
// 	.then((cart) => {
// 		app.listen(3000);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

//MongoDb
// mongoConnect(() => {
// 	app.listen(3000);
// });

//connecting to mongoose
mongoose
	.connect(
		"mongodb+srv://adriana:18032022@cluster0.s3blo.mongodb.net/shop?retryWrites=true&w=majority"
	)
	.then((result) => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: "Adriana",
					email: "test@test.com",
					cart: {
						items: [],
					},
				});
				user.save();
			}
		});
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
