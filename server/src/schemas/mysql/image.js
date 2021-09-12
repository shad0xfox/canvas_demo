const Sequelize = require("sequelize");

const schema = {
  x: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  y: {
    type: Sequelize.INTEGER,
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
