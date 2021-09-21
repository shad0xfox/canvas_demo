const router = require("express").Router();
const {
  handleLoginRequest,
  handleSignupRequest,
} = require("../../router-handlers/login");

router.post("/login", handleLoginRequest);
router.post("/signup", handleSignupRequest);

module.exports = router;
