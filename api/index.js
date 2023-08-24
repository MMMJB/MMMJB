const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const octo = require("octokit");
const { whitelist } = require("./../languages");

const app = express();
const octokit = new octo.Octokit({
  auth: process.env.GH_KEY,
  request: { fetch: fetch },
});

const port = 3000;
const user = "MMMJB";

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "test.html"));
});

app.get("/api/generate", async (req, res) => {
  res.setHeader("Content-Type", "text/json");
  res.setHeader("Cache-Control", "no-cache");

  const projectExts = [];

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
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1",
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

  const extFreq = projectExts.flat().reduce((a, c) => {
    return a[c] ? ++a[c] : (a[c] = 1), a;
  }, {});
  const sortedExts = Object.keys(extFreq)
    .sort((a, b) => extFreq[b] - extFreq[a])
    .reduce((a, c) => {
      return (a[c] = extFreq[c]), a;
    }, {});
  const connectedExts = projectExts.reduce((a, c) => {
    const u = [...new Set(c)];

    u.forEach((e) => {
      c.forEach((ec) => {
        if (!a[e]) a[e] = {};
        if (e === ec) return;

        a[e][ec] ? ++a[e][ec] : (a[e][ec] = 1);
      });
    });

    return a;
  }, {});
});

app.listen(port, (_) => {
  console.log(`App listening on port ${port}.`);
});
// module.exports = app;
