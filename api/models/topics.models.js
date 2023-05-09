const db = require("../../db/connection.js");

exports.selectTopics = () => {
  return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => rows)
    .catch((err) => {
      Promise.reject({ status: 500, msg: "Internal Server Error" });
    });
};
