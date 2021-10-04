const router = require("express").Router();
const {
  authenticateLoginCredentials,
} = require("../../middleware/authentication");
const {
  handleLoginRequest,
  handleSignupRequest,
} = require("../../router-handlers/login");

router.post("/login", authenticateLoginCredentials, handleLoginRequest);
router.post("/signup", handleSignupRequest);
router.post("/logout", (req, res, next) => {
  req.logOut();

  res.status(204).end();
});

module.exports = router;
