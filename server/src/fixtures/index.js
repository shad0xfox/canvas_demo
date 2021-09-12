require("../config");
const { connect } = require("../lib/db");

module.exports = async function () {
  try {
    await connect();

    await require("./fixture-image").drop();

    await require("./fixture-image").init();
  } catch (error) {
    console.log(error);
  }
};
