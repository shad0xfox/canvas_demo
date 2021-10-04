const router = require("express").Router();
const { handleGetUserRequest } = require("../../router-handlers/user");

router.get("/me", handleGetUserRequest);

module.exports = router;
