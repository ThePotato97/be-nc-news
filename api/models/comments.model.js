const db = require("../../db/connection.js");

exports.removeComment = (id) => {
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comments.comment_id = $1
        RETURNING *;
    `,
      [id]
    )
    .then(({ rows }) => {
      const removedComment = rows[0];
      if (!removedComment) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      }
      return;
    });
};
