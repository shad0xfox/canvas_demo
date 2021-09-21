const { getHashedText } = require("../lib/bcrypt");
const Model = require("../models/user");
const documents = require("./data/user");

async function bulkCreateDocument() {
  for (const document of documents) {
    if (document.password) {
      const hashedPassword = await getHashedText(document.password);
      document.password = hashedPassword;
    }
  }
  await Model.bulkCreate(documents);
}

async function init() {
  try {
    await bulkCreateDocument();
    console.log("[mysql][user] fixture done");
  } catch (error) {
    console.log("[mysql][user] fixture failed", error);
  }
}

function drop() {
  return Model.sync({ force: true });
}

exports.init = init;
exports.drop = drop;
