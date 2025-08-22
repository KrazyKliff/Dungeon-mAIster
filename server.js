const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log("Listening on " + port);
});

module.exports = app;