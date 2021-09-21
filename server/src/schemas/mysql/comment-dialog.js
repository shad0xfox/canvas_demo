const Sequelize = require("sequelize");
const {
  ENUM_COMMENT_DIALOG_TYPE,
  ENUM_COMMENT_DIALOG_STATUS,
} = require("../../lib/enum");

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
    defaultValue: ENUM_COMMENT_DIALOG_TYPE.NORMAL,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: ENUM_COMMENT_DIALOG_STATUS.PENDING,
  },
};

const indexes = {};

module.exports = {
  schema,
  indexes,
};
