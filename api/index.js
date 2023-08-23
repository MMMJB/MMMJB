const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const octo = require("octokit");

const app = express();
const octokit = new octo.Octokit({
  auth: process.env.GH_KEY,
  request: { fetch: fetch },
});

const port = 3000;
const user = "MMMJB";

const blacklist = ["gitignore", "LICENSE"];

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "test.html"));
});

app.get("/api/generate", async (req, res) => {
  res.setHeader("Content-Type", "text/json");
  res.setHeader("Cache-Control", "no-cache");

  const response = [];

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

      const languages = repo["data"]["tree"].reduce((a, c) => {
        if (c.type === "blob") {
          const extension = c.path.substring(c.path.lastIndexOf(".") + 1);

          if (!blacklist.includes(extension)) a.push(extension);
        }

        return a;
      }, []);

      response.push(languages);
    })
  );

  res.send(response);
});

app.listen(port, (_) => {
  console.log(`App listening on port ${port}.`);
});
// module.exports = app;
