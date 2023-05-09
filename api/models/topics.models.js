const db = require("../../db/connection.js");

exports.selectTopics = () => {
  console.log("select");
  return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => rows)
    .catch((err) => {
      console.log(err);
      Promise.reject({ status: 500, msg: "Internal Server Error" });
    });
};
