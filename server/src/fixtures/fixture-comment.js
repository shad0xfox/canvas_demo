const Model = require("../models/comment");
const documents = require("./data/comment");

async function bulkCreateDocument() {
  await Model.bulkCreate(documents);
}

async function init() {
  try {
    await bulkCreateDocument();
    console.log("[mysql][comments] fixture done");
  } catch (error) {
    console.log("[mysql][comments] fixture failed", error);
  }
}

function drop() {
  return Model.sync({ force: true });
}

exports.init = init;
exports.drop = drop;
