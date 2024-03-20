const { pool } = require("../database");

class Customer {
  static async findAll(
    page = 1,
    pageSize = 5,
    sortBy = "id",
    sortOrder = "ASC",
    name = null,
    number = null,
    ageFrom = null,
    ageTo = null,
    dobFrom = null,
    dobTo = null
  ) {
    page = +page;
    pageSize = +pageSize;
    const validSortColumns = [
      "id",
      "name",
      "age",
      "dateOfBirth",
      "gender",
      "number",
    ];
    const validSortOrders = ["ASC", "DESC"];

    // Validate sortBy and sortOrder
    sortBy = validSortColumns.includes(sortBy) ? sortBy : "id";
    sortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "ASC";

    const offset = (page - 1) * pageSize;
    let queryParameters = [];
    let conditions = [];

    // Handle name or number with OR condition
    if (name || number) {
      let orConditions = [];
      if (name) {
        orConditions.push("name LIKE ?");
        queryParameters.push(`%${name}%`);
      }
      if (number) {
        orConditions.push("number LIKE ?");
        queryParameters.push(`%${number}%`);
      }
      conditions.push(`(${orConditions.join(" OR ")})`);
    }

    // Handle age range with AND condition
    if (ageFrom) {
      conditions.push("age >= ?");
      queryParameters.push(ageFrom);
    }
    if (ageTo) {
      conditions.push("age <= ?");
      queryParameters.push(ageTo);
    }

    // Handle date of birth range with AND condition
    if (dobFrom) {
      conditions.push("dateOfBirth <= ?");
      queryParameters.push(dobFrom);
    }
    if (dobTo) {
      conditions.push("dateOfBirth >= ?");
      queryParameters.push(dobTo);
    }

    let queryCondition = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const queryRows = `SELECT * FROM customers ${queryCondition} ORDER BY ${sortBy} ${sortOrder} LIMIT ?, ?`;
    queryParameters.push(offset, pageSize);
    console.log(queryRows);
    const [rows] = await pool.query(queryRows, queryParameters);

    // For counting total items, consider the same conditions but without pagination parameters
    const queryTotal = `SELECT COUNT(*) AS totalItems FROM customers ${queryCondition}`;
    const totalParameters = queryParameters.slice(0, -2); // Exclude the pagination parameters for the total count
    const [[{ totalItems }]] = await pool.query(queryTotal, totalParameters);

    return {
      data: rows,
      totalItems,
    };
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      const error = new Error("Customer not found");
      error.status = 404;
      throw error;
    }
    return rows[0];
  }

  static async create(customerInfo) {
    const { name, age, dateOfBirth, gender, number } = customerInfo;
    if (isNaN(number)) {
      const error = new Error("Only numbers are allowed in the number field!");
      error.status = 400;
      throw error;
    }
    const [rows] = await pool.query(
      "INSERT INTO customers (name, age, dateOfBirth, gender, number) VALUES (?, ?, ?, ?, ?)",
      [name, age, dateOfBirth, gender, number]
    );
    return rows.insertId;
  }

  static async update(customerId, customerInfo) {
    const { name, age, dateOfBirth, gender, number } = customerInfo;

    const fieldsToUpdate = { name, age, dateOfBirth, gender, number };
    const setClause = [];
    const values = [];
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value !== undefined) {
        setClause.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (setClause.length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const sql = `UPDATE customers SET ${setClause.join(", ")} WHERE id = ?`;

    const [rows] = await pool.query(sql, [...values, customerId]);
    if (rows.affectedRows === 0) {
      const error = new Error("Customer with this id is not found!");
      error.status = 404;
      throw error;
    }
    return rows.affectedRows;
  }

  static async remove(id) {
    const [rows] = await pool.query("DELETE FROM customers WHERE id = ?", [id]);
    if (rows.affectedRows === 0) {
      const error = new Error("Customer with this id is not found!");
      error.status = 404;
      throw error;
    }
    return rows.affectedRows;
  }
}

module.exports = Customer;
