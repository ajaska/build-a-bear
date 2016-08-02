#!/bin/bash
set -euo pipefail

export ROOT_URL="//bear.plus";

npm run-script build
npm run-script build-css

cp ./meme-app.js ./dist/app.js
cp ./css/main.css ./dist/main.css

git subtree push --prefix dist origin gh-pages