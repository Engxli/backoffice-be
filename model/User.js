const { pool } = require("../database");

class User {
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }
}

module.exports = User;
