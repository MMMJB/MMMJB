const config = require("./config.json");

const generateBars = (username, sorted, title) => {
  const w = config.smallWidth,
    h = config.smallHeight;

  const image = `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" rx="16" fill="rgb(34, 39, 46)" stroke="rgb(68, 76, 86)" stroke-width="2"/>
    </svg>
  `;

  return image;
};

module.exports = generateBars;
