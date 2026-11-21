#!/bin/sh
# Render resume/resume.html to public/files/mike-jackson-resume.pdf using headless Chromium in Docker.
set -e
cd "$(dirname "$0")/.."
docker run --rm -v "$PWD":/work -w /tmp mcr.microsoft.com/playwright:v1.49.1-noble sh -c '
  npm i -s playwright@1.49.1 >/dev/null 2>&1
  node -e "
    const { chromium } = require(\"playwright\");
    (async () => {
      const b = await chromium.launch();
      const p = await b.newPage();
      await p.goto(\"file:///work/resume/resume.html\");
      await p.pdf({ path: \"/work/public/files/mike-jackson-resume.pdf\", format: \"Letter\", preferCSSPageSize: true, printBackground: true });
      await b.close();
    })();
  "'
echo "Wrote public/files/mike-jackson-resume.pdf"
