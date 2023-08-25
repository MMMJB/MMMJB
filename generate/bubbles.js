const config = require("./config.json");

const generateBubbles = (username, sorted, title) => {
  const w = config.largeWidth,
    h = config.largeHeight,
    cs = config.bubbles.maxRad,
    s = config.bubbles.spacing;

  const sizes = Object.keys(sorted).reduce((a, c) => {
    return (a[c] = (sorted[c] / sorted[Object.keys(sorted)[0]]) * cs), a;
  }, {});
  const sizeArr = Object.keys(sizes);

  const totalWidth =
    sizeArr.reduce((p, c) => p + sizes[c] * 2, 0) + sizeArr.length * s;

  const image = `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes enter {
          0% { transform: scale(15) translate(-300px, 0px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }

        @keyframes rotate {
          0%, 100% { translate: 0px -2px }
          12.5% { translate: 1px -.5px }
          25% { translate: 2px 0px }
          37.5% { translate: 1px .5px }
          50% { translate: 0px 2px }
          62.5 { translate: -1px .5px }
          75% { translate: -2px 0px }
          87.5% { translate: -1px -.5px }
        }
      
        text {
           font-family: "system-ui", "sans-serif";
        }

        .bubble text {
          fill: rgba(255, 255, 255, .5);
          font-size: 12px;
          text-transform: uppercase;
        }

        .bubble {
          animation: enter 3s ease forwards, rotate 10s linear infinite;
        }

        .bubble:nth-child(odd) {
          animation-direction: normal, reverse;
        }
      </style>
      
      <defs>
        <clipPath id="boxClip">
          <rect x="-80px" y="-50%" width="${w}" height="${h}" rx="16" />
        </clipPath>
      </defs>

      <rect width="${w}" height="${h}" rx="16" fill="rgb(34, 39, 46)" stroke="rgb(68, 76, 86)" stroke-width="2"/>

      <g id="bubbles" clip-path="url(#boxClip)" transform="translate(${
        w / 2 - totalWidth / 2
      }, ${h / 2})">
        ${sizeArr
          .map((e, i) => {
            const x =
              sizeArr
                .slice(0, i + 1)
                .reduce(
                  (p, c, i) => p + sizes[c] + (sizes[sizeArr[i - 1]] || 0),
                  0
                ) +
              i * s;

            const fill = `hsl(${
              ((sizeArr.length - i) / sizeArr.length) * 300
            }, 75%, 60%)`;

            const r = sizes[e];
            const sc = (r / sizes[sizeArr[0]]) * 12;

            return `
              <g class="bubble" dominant-baseline="middle" text-anchor="middle">
                <circle cx="${x}" cy="0" r="${r}" fill="${fill}" fill-opacity="75%" />
                <text x="${x}" y="${
              sc / 12
            }" style="font-size:${sc}px">${e}</text>
              </g>
            `;
          })
          .join("")}
      </g>

      <g dominant-baseline="middle" text-anchor="middle">
        <text x="${w / 2}" y="18" fill="white">${
    title !== undefined ? title : `${username}'s Languages Used`
  }</text>
        <text x="${w / 2}" y="${
    h - 12
  }" fill="white" fill-opacity="50%" font-size="8px">Based on number of files of type created in all public repositories.</text>
      </g>
    </svg>
  `;

  return image;
};

module.exports = generateBubbles;
