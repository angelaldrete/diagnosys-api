module.exports.verifyNotAuth = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  next();
};
