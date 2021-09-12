const Sequelize = require("sequelize");

const schema = {
  dialogId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const indexes = {};

module.exports = {
  schema,
  indexes,
};
