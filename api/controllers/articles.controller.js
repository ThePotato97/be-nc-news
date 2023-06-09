const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addComment,
  updateArticleVotes,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      const firstArticle = article;
      res.status(200).send({ article: firstArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  addComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by: sortBy, order } = req.query;
  selectArticles(topic, sortBy, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err)
    });
};

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
