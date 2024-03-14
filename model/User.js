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

  static async create(userInfo) {
    const { name, email, password } = userInfo;
    const [rows] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return rows.insertId;
  }
}

module.exports = User;
