module.exports = (req, res, next) => {
  if (!req.user) {
    return next({ message: "Not login", status: 401 });
  }
  next();
};
