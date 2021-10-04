const passport = require("./passport");

function authenticateLoginCredentials(req, res, next) {
  passport.authenticateCredentials("PASSWORD_LOGIN", req, res, next);
}

module.exports = {
  authenticateLoginCredentials,
};
