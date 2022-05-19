// const mysql = require("mysql2");

// const pool = mysql.createPool({
// 	host: "localhost",
// 	user: "root",
// 	database: "node",
// 	password: "18031986",
// });

// module.exports = pool.promise();

//sequelize
// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("node", "root", "18031986", {
// 	dialect: "mysql",
// 	host: "localhost",
// });

// module.exports = sequelize;

//MongoDb
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		"mongodb+srv://adriana:18032022@cluster0.s3blo.mongodb.net/shop?retryWrites=true&w=majority"
	)
		.then((client) => {
			console.log("Connected!");
			//access to the database
			_db = client.db();
			callback(client);
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
