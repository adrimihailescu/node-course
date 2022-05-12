// const mysql = require("mysql2");

// const pool = mysql.createPool({
// 	host: "localhost",
// 	user: "root",
// 	database: "node",
// 	password: "18031986",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node", "root", "18031986", {
	dialect: "mysql",
	host: "localhost",
});

module.exports = sequelize;
