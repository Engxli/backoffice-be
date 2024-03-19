const { pool } = require("../database");

class Customer {
  static async findAll(
    page = 1,
    pageSize = 5,
    sortBy = "id",
    sortOrder = "ASC",
    name = null, // Optional parameter for searching by name
    number = null // Optional parameter for searching by number
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

    // Start building the query based on provided filters
    let queryCondition = "";
    let queryParameters = [];

    // If name or number is provided, adjust the query to include a WHERE clause
    if (name || number) {
      console.log("yay filtering by name or number", name, number);
      let conditions = [];
      if (name) {
        conditions.push("name LIKE ?");
        queryParameters.push(`%${name}%`);
      }
      if (number) {
        conditions.push("number LIKE ?");
        queryParameters.push(`%${number}%`);
      }
      queryCondition = `WHERE ${conditions.join(" OR ")}`;
    }

    const queryRows = `SELECT * FROM customers ${queryCondition} ORDER BY ${sortBy} ${sortOrder} LIMIT ?, ?`;
    // Adding the offset and pageSize to the query parameters
    queryParameters.push(offset, pageSize);

    const [rows] = await pool.query(queryRows, queryParameters);

    // For counting total items, consider the same conditions
    const queryTotal = `SELECT COUNT(*) AS totalItems FROM customers ${queryCondition}`;
    const [[{ totalItems }]] = await pool.query(
      queryTotal,
      queryParameters.slice(0, -2)
    ); // Exclude limit params for total count

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
