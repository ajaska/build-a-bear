#!/bin/bash
set -euo pipefail

export NODE_ENV="production";
export ROOT_URL="//bear.plus";

npm run-script build
npm run-script build-css

cp ./meme-app.js ./dist/app.js
cp ./css/main.css ./dist/css/main.css

git commit -m "Update dist to $(git rev-parse --short HEAD)" -- ./dist/
git subtree push --prefix dist origin gh-pages
git push origin master
