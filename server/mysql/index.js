const mysql = require("mysql");
const sql = require("./sql");
const logger = require("../winston/logger"); // logger.js 가져오기

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: process.env.MYSQL_LIMIT,
});

const query = (alias, values, where = "") => {
  return new Promise((resolve, reject) => {
    pool.query(sql[alias] + where, values, (error, results) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const getConnection = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject({ err });
      } else {
        resolve(conn);
      }
    });
  });
};

module.exports = {
  query,
  getConnection,
};
