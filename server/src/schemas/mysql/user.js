const Sequelize = require("sequelize");

const schema = {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const indexes = {};

module.exports = {
  schema,
  indexes,
};
