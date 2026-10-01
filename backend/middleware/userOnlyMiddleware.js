const userOnlyMiddleware = (req, res, next) => {
  // Check user's role
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      message: "Demo users cannot add, edit or delete contacts. Please signup/login as a registered user.",
    });
  }

  next();
};

module.exports = userOnlyMiddleware;