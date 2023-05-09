const { readFile } = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
  return readFile(`${__dirname}/../../endpoints.json`)
    .then((json) => {
      return res.status(200).send(JSON.parse(json.toString()));
    })
    .catch((err) => {
      next(err);
    });
};
