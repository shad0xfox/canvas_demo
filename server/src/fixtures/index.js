require("../config");
const { connect } = require("../lib/db");

module.exports = async function () {
  try {
    await connect();

    await require("./fixture-image").drop();
    await require("./fixture-comment").drop();
    await require("./fixture-comment-dialog").drop();
    await require("./fixture-user").drop();

    await require("./fixture-image").init();
    await require("./fixture-comment").init();
    await require("./fixture-comment-dialog").init();
    await require("./fixture-user").init();
  } catch (error) {
    console.log(error);
  }
};
