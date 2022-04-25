// const products = [];
const fs = require("fs");
const path = require("path");

const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"products.json"
);

//helper function          cb= callback function
const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(t) {
		this.title = t;
	}
	// method available in this class
	save() {
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}
	//retrieve all products from the array, method that calls directly on the class itself
	static fetchAll(cb) {
		getProductsFromFile(cb);
	}
};
