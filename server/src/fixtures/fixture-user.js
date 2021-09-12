const Model = require("../models/user");
const documents = require("./data/user");

async function bulkCreateDocument() {
  await Model.bulkCreate(documents);
}

async function init() {
  try {
    await bulkCreateDocument();
    console.log("[mysql][users] fixture done");
  } catch (error) {
    console.log("[mysql][users] fixture failed", error);
  }
}

function drop() {
  return Model.sync({ force: true });
}

exports.init = init;
exports.drop = drop;