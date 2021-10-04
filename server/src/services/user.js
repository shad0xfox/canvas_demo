const UserStore = require("../stores/user");

module.exports = {
  getUserByEmail: UserStore.getUserByEmail,
  getUserById: UserStore.getUserById,
  createUser: UserStore.createUser,

  USER_PROJECTIONS: {
    MIN: UserStore.MIN_PROJECTIONS,
    ID_AND_NAME: UserStore.ID_AND_NAME_PROJECTIONS,
    ID_NAME_AND_PASSWORD: UserStore.ID_NAME_AND_PASSWORD_PROJECTIONS,
  },
};
