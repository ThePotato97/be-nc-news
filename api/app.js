const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { errorHandling } = require("./middlewares/errorHandling.middleware");
const { getEndpoints } = require("./controllers/endpoints.controller");

const app = express();

app.use(errorHandling);

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

module.exports = app;
