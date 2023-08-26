const config = require("./config.json");

const generateBubbles = require("./bubbles");
const generateBars = require("./bars");
const generateError = require("./error");

const generateBoth = (username, sorted, title, theme) => {
  const bubbles = generateBubbles(username, sorted, title, theme);
  const bars = generateBars(sorted, title, theme);

  const h = config.largeHeight,
    g = config.largeWidth + config.both.spacing,
    w = config.largeWidth + config.smallWidth + config.both.spacing;

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

const generateGraph = (sorted, options) => {
  const { type, user, title, theme } = options;

  switch (type) {
    case "bubble":
      return generateBubbles(user, sorted, title, theme);
    case "bar":
      return generateBars(sorted, title, theme);
    case "both":
      return generateBoth(user, sorted, title, theme);
    default:
      return generateBubbles(user, sorted, title, theme);
  }
};

module.exports = {
  generateBubbles: generateBubbles,
  generateBars: generateBars,
  generateError: generateError,
  generateBoth: generateBoth,
  generateGraph: generateGraph,
};
