const Model = require("../models/user");

const ID_AND_NAME_PROJECTIONS = ["id", "name"];
const ID_NAME_AND_PASSWORD_PROJECTIONS = ["id", "name", "password"];

function getUserByEmail(email, { projections } = {}) {
  return Model.findOne({
    attributes: projections,
    where: {
      email,
    },
  });
}

function createUser(row) {
  return Model.create(row);
}

module.exports = {
  getUserByEmail,
  createUser,

  ID_AND_NAME_PROJECTIONS,
  ID_NAME_AND_PASSWORD_PROJECTIONS,
};
