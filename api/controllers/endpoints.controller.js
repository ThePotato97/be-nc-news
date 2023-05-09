const { selectEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then((docs) => {
    res.status(200).send(docs);
  });
};
