const { readFile } = require("fs/promises");

exports.selectEndpoints = () => {
  return readFile(`${__dirname}/../../endpoints.json`).then((json) => {
    return JSON.parse(json.toString());
  });
};
