const express = require("express");
const passport = require("passport");
const { login, register } = require("./controller");
const router = express.Router();

// middlewares
const local = passport.authenticate("local", { session: false });
// routes
router.post("/register", register);
router.post("/login", local, login);

module.exports = router;
