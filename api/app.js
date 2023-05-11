const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { errorHandling } = require("./middlewares/errorHandling.middleware");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchArticle,
} = require("./controllers/articles.controller");

const app = express();

app.use(express.json());

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.use(errorHandling);

module.exports = app;
