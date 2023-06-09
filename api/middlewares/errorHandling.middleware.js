exports.errorHandling = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).json({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid Body" });
  } else {
    console.error("unhandled", err)
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
