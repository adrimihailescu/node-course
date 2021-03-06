const path = require("path");

const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

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
const MONGODB_URI =
	"mongodb+srv://adriana:18032022@cluster0.s3blo.mongodb.net/shop";

const app = express();

const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions",
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + "-" + file.originalname);
	},
});

// app.engine(
// 	"hbs",
// 	expressHbs({
// 		layoutsDir: "views/layouts/",
// 		defaultLayout: "main-layout",
// 		extname: "hbs",
// 	})
// );

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
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
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialised: false,
		store: store,
	})
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	//these 2 fields will be set for the views that are rendered
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

//mongoDb
app.use((req, res, next) => {
	//sequelize setup is with findByPk()
	// User.findById("6290ce5b5172d69a5fe24990")
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)

		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			throw new Error(err);
		});
});

//routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
	// res.status(error.httpStatusCode).render(...);
	// res.redirect('/500');
	res.status(500).render("500", {
		pageTitle: "Error!",
		path: "/500",
		isAuthenticated: req.session.isLoggedIn,
	});
});

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
	.connect(MONGODB_URI)
	.then((result) => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
