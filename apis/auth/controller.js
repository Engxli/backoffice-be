const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config");
const User = require("../../model/User");

const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(payload, config.token.secret_key, {
    expiresIn: config.token.expiresIn,
  });

  return token;
};

const hashThePass = async (password, next) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    req.body.password = await hashThePass(req.body.password, next);
    const user = await User.create(req.body);
    const token = generateToken(user);
    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
