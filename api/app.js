const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { errorHandling } = require("./middlewares/errorHandling.middleware");

const app = express();

app.use(errorHandling);

app.get("/api/topics", getTopics);

module.exports = app;
