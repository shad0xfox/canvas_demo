const { Sequelize } = require("sequelize");
const { DB_SCHEMA, DB_USER_NAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

/** @type {Sequelize} */
let sequelize = null;

/**
 *
 * @returns {Sequelize} Sequelize
 */
function getInstance() {
  return sequelize;
}

async function connect() {
  console.log(`connecting ${DB_HOST}/${DB_SCHEMA}...`);

  sequelize = new Sequelize(DB_SCHEMA, DB_USER_NAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    timezone: "+08:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      decimalNumbers: true,
    },
    define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true,
    },
  });

  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(error);

    throw error;
  }

  console.log(`connected ${DB_HOST}/${DB_SCHEMA}`);
}

module.exports = {
  getInstance,
  connect,
};
