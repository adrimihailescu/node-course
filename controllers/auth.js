exports.getLogin = (req, res, next) => {
	// console.log(req.get("Cookie"));
	// const isLoggedIn =
	// 	req.get("Cookie").split(";")[1].trim().split("=")[1] === "true";
	console.log(req.session.isLoggedIn);
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res, next) => {
	// req.isLoggedIn = true;
	// res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
	req.session.isLoggedIn = true;
	res.redirect("/");
};
