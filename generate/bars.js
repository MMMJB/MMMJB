const config = require("./config.json");

const generateBars = (sorted, title, theme) => {
  const w = config.smallWidth,
    h = config.smallHeight,
    m = h / 8,
    mw = w - m * 3.5,
    s = config.bar.spacing;

  const maxItems = title ? 6 : 7;

  const sizes = Object.keys(sorted).reduce((a, c) => {
    return (a[c] = (sorted[c] / sorted[Object.keys(sorted)[0]]) * mw), a;
  }, {});
  const sizeArr = Object.keys(sizes).slice(0, maxItems);

  if (sizeArr.length !== Object.keys(sizes).length) {
    const key = `+ ${Object.keys(sizes).length - sizeArr.length}`;
    const extras = Object.keys(sorted)
      .slice(sizeArr.length)
      .reduce((a, c) => a + sorted[c], 0);

    sizes[key] = Math.min((extras / sorted[Object.keys(sorted)[0]]) * mw, mw);
    sorted[key] = extras;
    sizeArr.push(key);
  }

  const calculateY = (i) => (title ? m * 2 : m * 1.25) + i * 12 + i * s;
  const calculateFill = (i) =>
    `hsl(${((sizeArr.length - i) / sizeArr.length) * 300}, 75%, 60%)`;

  const t = theme || "light";

  const image = `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes extend {
          from { transform: scale(0, 1); }
          to { transform: scale(1, 1); }
        }

        :root {
          --text: ${t === "light" ? config.text.light : config.text.dark};
          --fill: ${t === "light" ? config.fill.light : config.fill.dark};
          --stroke: ${t === "light" ? config.stroke.light : config.stroke.dark};
        }

        text {
           font-family: "system-ui", "sans-serif";
           fill: var(--text);
        }

        .bar-shadow {
          opacity: .15;
          filter: saturate(0);
        }

        .bar {
          transform-origin: 58px center;
          animation: extend 1.5s ease forwards;
          opacity: .75;
        }

        .label {
          fill-opacity: 75%;
          text-transform: uppercase;
          font-size: 12px;
        }

        .num {
          fill-opacity: 25%;
          font-size: 10px;
        }
      </style>

      <rect width="${w}" height="${h}" rx="16" fill="var(--fill)" stroke="var(--stroke)" />

      <g dominant-baseline="middle" text-anchor="end">
        ${sizeArr
          .map((e, i) => {
            const y = calculateY(i);
            const w = sizes[e];
            const fill = calculateFill(i);

            return `
              <text class="label" x="${m * 2}" y="${y}">${e}</text>
              
              <rect class="bar-shadow" x="${m * 2 + 8}" y="${
              y - 6
            }" width="${w}" height="12" fill="${fill}" rx="4" />
              <rect class="bar" x="${m * 2 + 8}" y="${
              y - 6
            }" width="${w}" height="12" fill="${fill}" rx="4" />
              
              <text text-anchor="start" class="num" x="${
                w + m * 2 + 12
              }" y="${y}">${sorted[e]}</text>
            `;
          })
          .join("")}
      </g>

      ${
        (title &&
          `<text dominant-baseline="middle" text-anchor="middle" x="${
            w / 2
          }" y="24">${title}</text>`) ||
        ""
      }
    </svg>
  `;

  return image;
};

module.exports = generateBars;
