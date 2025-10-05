module.exports = function hasRole(roles) {
  return function (req, res, next) {
    console.log('req.user ', req.session.user)
    if (!req.session.user.role || !roles.includes(req.session.user.role)) {
      return res.status(403).send("Access denied.");
    }
    next();
  };
};

