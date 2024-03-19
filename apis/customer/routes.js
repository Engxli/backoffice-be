const express = require("express");
const passport = require("passport");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./controller");
const router = express.Router();

// middlewares
const jwt = passport.authenticate("jwt", { session: false });
// routes
router.get("/", jwt, getAllCustomers);
router.get("/:id", jwt, getCustomerById);
router.post("/", jwt, createCustomer);
router.put("/:id", jwt, updateCustomer);
router.delete("/:id", jwt, deleteCustomer);

module.exports = router;
