const bycrypt = require("bcrypt");
const saltRounds = 10;

function getHashedText(plainText) {
  return bycrypt.hash(plainText, saltRounds);
}

function compare(data, encrypetedData) {
  return bycrypt.compare(data, encrypetedData);
}

module.exports = {
  getHashedText,
  compare,
};
