const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    next(err);
  }
});

app.get("/api/topics", getTopics);

module.exports = app;
