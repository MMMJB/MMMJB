const express = require("express");
const path = require("path");
// const IP = require("ip");

const app = express();

const port = 3000;

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "test.html"));
});

app.get("/api/generate", (req, res) => {
  const width = 600,
    height = 200,
    fontSize = 24;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  // const ip = IP.address();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const image = `
    <svg viewbox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes reveal {
          to {
            opacity: 1;
            translate: 0 0;
          }
        }

        text {
          font-size: ${fontSize}px;
          font-family: system-ui;
          fill: rgba(255, 255, 255, .75);
        }

        .ip-text {
          font-family: monospace;
          opacity: 0;
          translate: 0 -8px;
          animation: reveal 200ms ease-out forwards;
          fill: white;
        }
      </style>

      <rect x="0" width="${width}" height="${height}" rx="16" fill="rgb(34, 39, 46)" stroke="rgb(68, 76, 86)" stroke-width="2"/>
      
      <text class="ip-text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
        ${ip
          .split("")
          .map((c, i) => {
            return `<tspan style="animation-delay: ${i * 25}ms">${c}</tspan>`;
          })
          .join("")}
      </text>
    </svg>
  `;

  res.send(image);
});

app.listen(port, (_) => {
  console.log(`App listening on port ${port}.`);
});
// module.exports = app;
