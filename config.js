require("dotenv").config();
const config = {
  port: process.env.PORT,
  secret_key: process.env.SECRET_KEY,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

for (let key in config) {
  if (config[key] == undefined) {
    throw Error(`Your .env is mising this key: [${key}]`);
  }
}
module.exports = config;
