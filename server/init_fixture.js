require("./src/fixtures")()
  .then(() => {
    console.log("[mysql] fixtures done");
  })
  .then(() => {
    process.exit(0);
  });
