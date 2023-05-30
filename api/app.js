const express = require("express");
const cors = require('cors');
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
const { getUsers } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getEndpoints);

app.use(errorHandling);

module.exports = app;
