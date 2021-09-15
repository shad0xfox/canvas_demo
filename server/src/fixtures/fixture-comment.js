const Model = require("../models/comment");
const documents = require("./data/comment");

async function bulkCreateDocument() {
  await Model.bulkCreate(documents);
}

async function init() {
  try {
    await bulkCreateDocument();
    console.log("[mysql][comment] fixture done");
  } catch (error) {
    console.log("[mysql][comment] fixture failed", error);
  }
}

function drop() {
  return Model.sync({ force: true });
}

exports.init = init;
exports.drop = drop;
