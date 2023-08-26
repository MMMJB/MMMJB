const config = require("./config.json");

const generateError = (text, subtext) => {
  const w = config.largeWidth,
    h = config.largeHeight;

  return `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" rx="16" fill="rgb(34, 39, 46)" stroke="rgb(68, 76, 86)" />

      <g dominant-baseline="middle" text-anchor="middle">
        <text x="50%" y="50%" fill="red" font-size="16px">Error generating image: ${text}.</text>
        ${
          subtext
            ? `<text x="50%" y="${
                h / 2 + 18
              }" fill="red" fill-opacity="50%" font-size="12px">${subtext}.</text>`
            : ""
        }
      </g>
    </svg>
  `;
};

module.exports = generateError;
