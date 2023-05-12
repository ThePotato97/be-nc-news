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

exports.selectArticles = (topic, sortBy = "created_at", order = "desc") => {
  const validColumns = ["created_at", "author", "title", "article_id", "topic", "created_at", "votes", "article_img_url"]
  const topicQuery = topic !== undefined ? `WHERE articles.topic = $1` : ``
  const queryParams = topic !== undefined ? [topic] : []

  const sort = validColumns.includes(sortBy) ? sortBy : "created_at"
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      ${topicQuery}
      GROUP BY articles.article_id 
      ORDER BY articles.${sort} ${order.toUpperCase() === "ASC" ? "ASC" : "DESC"};
  `,
      queryParams
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
    .then(({ rows }) => rows[0]);
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

exports.updateArticleVotes = (id, votes) => {
  return this.selectArticleById(id).then(() => {
    return db
      .query(
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        returning *;
      `,
        [votes, id]
      )
      .then(({ rows }) => rows[0]);
  });
};
