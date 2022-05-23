//sequelize
// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const User = sequelize.define("user", {
// 	id: {
// 		type: Sequelize.INTEGER,
// 		autoIncrement: true,
// 		allowNull: false,
// 		primaryKey: true,
// 	},
// 	name: Sequelize.STRING,
// 	email: Sequelize.STRING,
// });
const mongodb = require("mongodb");
const db = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
	constructor(username, email) {
		this.name = username;
		this.email = email;
	}

	save() {
		const db = getDb();
		return db.collection("users").insertOne(this);
	}

	static findById(userId) {
		const db = getDb();
		return db.collection("users").findOne({ _id: new ObjectId(userId) });
	}
}
module.exports = User;
