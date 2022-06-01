//this middleware will allow us to see the cart, orders and admin only if we are logged in
//has to be passed to both admin and shop routes

module.exports = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	next();
};
