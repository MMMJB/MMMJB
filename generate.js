const generateGraph = (sorted, connected) => {
  const w = 600,
    h = 200,
    cs = h / 6,
    s = 8;

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
          0% { transform: scale(20) translate(-300px, 0px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }
      
        text {
          fill: rgba(255, 255, 255, .5);
          font-family: "system-ui", "sans-serif";
          font-size: 12px;
          text-transform: uppercase;
        }

        .bubble {
          animation: enter 3s ease forwards;
        }
      </style>
      
      <rect x="0" width="${w}" height="${h}" rx="16" fill="rgb(34, 39, 46)" stroke="rgb(68, 76, 86)" stroke-width="2"/>

      <g id="bubbles" transform="translate(${w / 2 - totalWidth / 2}, ${
    h / 2
  })">
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
    </svg>
  `;

  return image;
};

exports.generateGraph = generateGraph;
