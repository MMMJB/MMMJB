const express = require("express");
const app = express();

const port = 3000;

app.get("/api/generate", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  res.send(req.socket.remoteAddress);
});

// app.listen(port, (_) => {
//   console.log(`App listening on port ${port}.`);
// });
module.exports = app;
