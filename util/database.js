const mysql = require("mysql2");

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	database: "node",
	password: "18031986",
});

module.exports = pool.promise();
