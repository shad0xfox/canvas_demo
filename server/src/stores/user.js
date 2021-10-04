const Model = require("../models/user");

const MIN_PROJECTIONS = ["id", "name", "email"];
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

function getUserById(id, { projections } = {}) {
  return Model.findOne({
    attributes: projections,
    where: {
      id,
    },
  });
}

function createUser(row) {
  return Model.create(row);
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,

  MIN_PROJECTIONS,
  ID_AND_NAME_PROJECTIONS,
  ID_NAME_AND_PASSWORD_PROJECTIONS,
};
