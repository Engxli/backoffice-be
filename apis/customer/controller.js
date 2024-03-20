const Customer = require("../../model/Customer");

const getAllCustomers = async (req, res, next) => {
  try {
    const {
      page,
      pageSize,
      sortBy,
      sortOrder,
      name,
      number,
      ageFrom,
      ageTo,
      dobFrom,
      dobTo,
    } = req.query;

    const customers = await Customer.findAll(
      page,
      pageSize,
      sortBy,
      sortOrder,
      name,
      number,
      ageFrom,
      ageTo,
      dobFrom,
      dobTo
    );
    return res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    return res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customerId = await Customer.create(req.body);
    return res.status(201).json(customerId);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const affectedRows = await Customer.update(req.params.id, req.body);
    return res.status(200).json(affectedRows);
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const affectedRows = await Customer.remove(req.params.id);
    return res.status(200).json(affectedRows);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
