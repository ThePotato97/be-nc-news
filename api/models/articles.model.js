const db = require("../../db/connection.js");

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => rows)
    .catch((err) => {
      Promise.reject({ status: 500, msg: "Internal Server Error" });
    });
};
