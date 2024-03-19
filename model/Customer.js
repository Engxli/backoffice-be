const { pool } = require("../database");

class Customer {
  static async findAll(
    page = 1,
    pageSize = 25,
    sortBy = "id",
    sortOrder = "ASC"
  ) {
    page = +page;
    pageSize = +pageSize;
    const validSortColumns = ["id", "name", "age", "dateOfBirth", "gender"];
    const validSortOrders = ["ASC", "DESC"];

    // Validate sortBy and sortOrder
    sortBy = validSortColumns.includes(sortBy) ? sortBy : "id";
    sortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "ASC";

    const offset = (+page - 1) * +pageSize;

    // Query for fetching paginated rows
    const queryRows = `SELECT * FROM customers ORDER BY ${sortBy} ${sortOrder} LIMIT ?, ?`;
    const [rows] = await pool.query(queryRows, [offset, pageSize]);

    // Query for counting total items
    const queryTotal = "SELECT COUNT(*) AS totalItems FROM customers";
    const [[{ totalItems }]] = await pool.query(queryTotal);

    // Return both the paginated data and the total item count
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
    const { name, age, dateOfBirth, gender } = customerInfo;
    const [rows] = await pool.query(
      "INSERT INTO customers (name, age, dateOfBirth, gender) VALUES (?, ?, ?, ?)",
      [name, age, dateOfBirth, gender]
    );
    return rows.insertId;
  }

  static async update(customerId, customerInfo) {
    const { name, age, dateOfBirth, gender } = customerInfo;

    const fieldsToUpdate = { name, age, dateOfBirth, gender };
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
    return rows.affectedRows;
  }
}

module.exports = Customer;
