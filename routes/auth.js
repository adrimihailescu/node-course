const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

// router.post("/signup", authController.postSignup); //must be validated

router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.custom((value, { req }) => {
				// if (value === "test@test.com") {
				// 	throw new Error("This email address is forbidden");
				// }
				// return true;
				return (
					User.findOne({ email: value }) //asyncronous validation
						//check if the user exist
						.then((userDoc) => {
							if (userDoc) {
								return Promise.reject(
									"Email exists already, please pick a different one."
								);
							}
						})
				);
			}),
		body("password").isLength({ min: 5 }).isAlphanumeric(),
		body("confirmPassword").custom((value, { req }) => {
			if (value !== req.body.pasword) {
				throw new Error("Passwords have to match!");
			}
			return true;
		}),
	],
	authController.postSignup
); //must be validated

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
