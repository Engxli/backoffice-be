const { pool } = require("../database");

class Customer {
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM customers");
    return rows;
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
