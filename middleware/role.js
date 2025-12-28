module.exports = function (role) {
  return (req, res, next) => {
    if (req.admin.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
