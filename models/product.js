const products = [];

module.exports = class Product {
	constructor(t) {
		this.title = t;
	}
	// method available in this class
	save() {
		products.push(this);
	}
	//retrieve all products from the array, method that calls directly on the class itself
	static fetchAll() {
		return products;
	}
};
