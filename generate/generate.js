const config = require("./config.json");

const generateBubbles = require("./bubbles");
const generateBars = require("./bars");
const generateError = require("./error");

const generateBoth = (username, sorted, title, theme) => {
  const bubbles = generateBubbles(username, sorted, title, theme);
  const bars = generateBars(sorted, title, theme);

  const h = config.largeHeight,
    g = config.largeWidth + config.both.spacing,
    w = config.largeWidth + config.smallWidth + g;

  return `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <g>
        ${bubbles}
      </g>
      <g transform="translate(${g} 0)">
        ${bars}
      </g>
    </svg>
  `;
};

module.exports = {
  generateBubbles: generateBubbles,
  generateBars: generateBars,
  generateError: generateError,
  generateBoth: generateBoth,
};
