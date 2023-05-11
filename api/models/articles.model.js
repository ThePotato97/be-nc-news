const db = require("../../db/connection.js");

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      const firstArticle = rows.pop();
      if (!firstArticle) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return firstArticle;
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC;      
  `
    )
    .then(({ rows }) => rows);
};

exports.addComment = (id, username, body) => {
  return this.selectArticleById(id)
    .then(() => {
      return db.query(
        `
    INSERT INTO comments(article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
        [id, username, body]
      );
    })
    .then(({ rows }) => rows.pop());
};

exports.selectCommentsByArticleId = (id) => {
  return this.selectArticleById(id)
    .then(() => {
      return db.query(
        `
      SELECT * FROM comments 
      WHERE article_id = $1
      ORDER BY comments.created_at DESC;
  `,
        [id]
      );
    })

    .then(({ rows }) => rows);
};
