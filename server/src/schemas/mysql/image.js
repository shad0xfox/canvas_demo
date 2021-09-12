const Sequelize = require("sequelize");

const schema = {
  x: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  y: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  path: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

const indexes = {};

module.exports = {
  schema,
  indexes,
};
