// require("dotenv").config();

const mysql = require("mysql");

const config = {
  database: {
    host: process.env.DB_HOST || "mnbx4.h.filess.io",
    user: process.env.DB_USER || "dynamicformgeneration_summerpath",
    password:
      process.env.DB_PASSWORD || "c1016f865beedad5c25ea8f2a4ef87fdf098f6c5",
    database: process.env.DB_NAME || "dynamicformgeneration_summerpath",
    port: process.env.DB_PORT || "3306",
  },
};

module.exports = config;

// module.exports = {
//     jwtSecret: 'your_secret_key_here', // Replace with a strong, random key
//     jwtExpiration: '1h' // Token expiration time (e.g., 1 hour)
// };
