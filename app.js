const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send(req.socket.remoteAddress);
});

app.listen(port, (_) => {
  console.log(`App listening on port ${port}.`);
});
