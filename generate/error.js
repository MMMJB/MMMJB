const config = require("./config.json");

const generateError = (text, subtext, theme) => {
  const w = config.largeWidth,
    h = config.largeHeight;

  const t = theme || "light";

  return `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        :root {
          --fill: ${t === "light" ? config.fill.light : config.fill.dark};
          --stroke: ${t === "light" ? config.stroke.light : config.stroke.dark};
        }
      </style>

      <rect width="${w}" height="${h}" rx="16" fill="var(--fill)" stroke="var(--stroke)" />

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
