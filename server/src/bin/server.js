require("../config");
const { createClient } = require("../lib/redis");

const db = require("../lib/db");
db.connect().then(async () => {
  await createClient();
  const { server } = require("../app");
  // finally, let's start our server...
  server.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + server.address().port);
  });
});
