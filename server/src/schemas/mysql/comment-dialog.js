const Sequelize = require("sequelize");
const { ENUM_TYPE } = require("../../lib/enum");

const schema = {
  x: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  y: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  typeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: ENUM_TYPE.NORMAL,
  },
};

const indexes = {};

module.exports = {
  schema,
  indexes,
};
