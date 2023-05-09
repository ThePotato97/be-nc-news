const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (Math.sign(article_id) !== 1) {
    next({ status: 404, msg: "Invalid parameter" });
    return;
  }
  selectArticleById(article_id)
    .then((article) => {
      const firstArticle = article[0];
      if (!firstArticle) {
        next({ status: 404, msg: "Article ID does not exist" });
        return;
      }
      res.status(200).send({ article: firstArticle });
    })
    .catch((err) => {
      next(err);
    });
};
