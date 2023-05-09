exports.errorHandling = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    next(err);
  }
};
