module.exports = function hasRole(roles) {
  return function (req, res, next) {
    console.log('req.user ', req.session.user)
    if (!req.session.user.role || !roles.includes(req.session.user.role)) {
      if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(403).json({ message: "Access denied." });
      }
      else
        return res.redirect('/error?message=Access denied');
    }
    next();
  };
};

