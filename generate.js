const generateGraph = (sorted, connected) => {
  const w = 600,
    h = 200,
    cs = h / 8;

  const sizes = Object.keys(sorted).reduce((a, c) => {
    return (a[c] = (sorted[c] / sorted[Object.keys(sorted)[0]]) * cs), a;
  }, {});
  const sizeArr = Object.keys(sizes);

  const totalWidth =
    sizeArr.reduce((p, c) => p + sizes[c] * 2, 0) + sizeArr.length * 4;

  const image = `
    <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <style>
        text {
          fill: white;
          font-family: "system-ui", "sans-serif";
          font-size: 12px;
          text-transform: uppercase;
        }
      </style>
      
      <rect x="0" width="${w}" height="${h}" rx="16" fill="rgb(34, 39, 46)" stroke="rgb(68, 76, 86)" stroke-width="2"/>

      <g transform="translate(${w / 2 - totalWidth / 2}, ${h / 2})">
        ${sizeArr
          .map((e, i) => {
            const x =
              sizeArr.slice(0, i).reduce((p, c) => p + sizes[c] * 2, 0) + i * 4;

            const fill = `hsl(${
              ((sizeArr.length - i) / sizeArr.length) * 300
            }, 75%, 60%)`;

            return `<circle cx="${x}" cy="0" r="${sizes[e]}" fill="${fill}" />`;
          })
          .join("")}
      </g>

      
    </svg>
  `;

  return image;
};

exports.generateGraph = generateGraph;
