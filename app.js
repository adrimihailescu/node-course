const path = require("path");

const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

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

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// db.execute("SELECT * FROM products")
// 	.then((result) => {
// 		console.log(result[0], result[1]);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	User.findByPk(1)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//with this sequelize will define the relations/associations and create tables
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
	// .sync({ force: true })
	.sync()
	.then((result) => {
		return User.findByPk(1);
	})
	.then((user) => {
		//check if i dont have a user then i call create method to create one
		if (!user) {
			return User.create({ name: "Adriana", email: "test@test.com" });
		}
		return user;
	})
	.then((user) => {
		// console.log(user);
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
