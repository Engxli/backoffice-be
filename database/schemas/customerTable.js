async function createCustomerTable(connection) {
  const sql = `
    CREATE TABLE IF NOT EXISTS customerTable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        dateOfBirth DATE NOT NULL,
        gender ENUM('male', 'female') NOT NULL
    )`;
  await connection.query(sql);
}

module.exports = createCustomerTable;
