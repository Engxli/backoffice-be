require("dotenv").config();
const config = {
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  token: {
    secret_key: process.env.SECRET_KEY,
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  },
};

function checkConfig(obj, parentKey = "") {
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // Recursively check nested objects
      checkConfig(obj[key], parentKey + key + ".");
    } else if (obj[key] === undefined) {
      // Throw an error if a property is undefined
      throw new Error(`Environment variable ${parentKey + key} is not defined`);
    }
  }
}

checkConfig(config);
module.exports = config;
