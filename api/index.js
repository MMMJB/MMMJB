const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const octo = require("octokit");

const generate = require("../generate/generate");

const whitelist = require("./../languages");
const data = require("./../testdata.json");

const app = express();

const port = 3000;

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "test.html"));
});

app.get("/api/generate", async (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader(
    "Cache-Control",
    "max-age=604800, stale-while-revalidate=86400"
  );

  const { key, user, recursive, theme } = req.query;

  if (!user)
    return res.send(
      generate.generateError(
        "a valid github user must be specified",
        "Reference using ?user=[user]",
        theme
      )
    );

  const octokit = new octo.Octokit({
    auth: key,
    request: { fetch: fetch },
  });

  const projectExts = [];

  try {
    const repos = await octokit.request("GET /users/{username}/repos", {
      username: user,
    });

    await Promise.all(
      repos["data"].map(async (r) => {
        const info = await octokit.request(
          "GET /repos/{owner}/{repo}/branches/{branch}",
          {
            owner: user,
            repo: r["name"],
            branch: r["default_branch"],
          }
        );

        const sha = info["data"]["commit"]["commit"]["tree"]["sha"];

        const repo = await octokit.request(
          `GET /repos/{owner}/{repo}/git/trees/{tree_sha}${
            recursive ? "?recursive=1" : ""
          }`,
          {
            owner: user,
            repo: r["name"],
            tree_sha: sha,
          }
        );

        const files = repo["data"]["tree"].reduce((a, c) => {
          if (c.type === "blob") {
            const extension = c.path.substring(c.path.lastIndexOf(".") + 1);

            if (Object.keys(whitelist).includes(extension)) a.push(extension);
          }

          return a;
        }, []);

        projectExts.push(files);
      })
    );
  } catch (err) {
    return res.send(generate.generateError(err.message, "", theme));
  }

  const extFreq = projectExts.flat().reduce((a, c) => {
    return a[c] ? ++a[c] : (a[c] = 1), a;
  }, {});

  const sortedExts = Object.keys(extFreq)
    .sort((a, b) => extFreq[b] - extFreq[a])
    .reduce((a, c) => {
      return (a[c] = extFreq[c]), a;
    }, {});

  // const sortedExts = data.long;
  const image = generate.generateGraph(sortedExts, req.query);

  return res.send(image);
});

app.listen(port, (_) => {
  console.log(`App listening on port ${port}.`);
});
// module.exports = app;
