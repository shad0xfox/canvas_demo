const Model = require("../models/comment-dialog");
const documents = require("./data/comment-dialog");

async function bulkCreateDocument() {
  await Model.bulkCreate(documents);
}

async function init() {
  try {
    await bulkCreateDocument();
    console.log("[mysql][comment_dialog] fixture done");
  } catch (error) {
    console.log("[mysql][comment_dialog] fixture failed", error);
  }
}

function drop() {
  return Model.sync({ force: true });
}

exports.init = init;
exports.drop = drop;
