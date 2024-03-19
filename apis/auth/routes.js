const express = require("express");
const passport = require("passport");
const { login, register } = require("./controller");
const router = express.Router();

// middlewares
const local = passport.authenticate("local", { session: false });
const jwt = passport.authenticate("jwt", { session: false });
// routes
router.post("/register", jwt, register);
router.post("/login", local, login);

module.exports = router;
