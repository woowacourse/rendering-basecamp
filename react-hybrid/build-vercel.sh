#!/bin/sh
set -eu

output=.vercel/output
server=$output/functions/server.func

rm -rf "$output"
mkdir -p "$server" "$output/static"
cp dist/server/server.js "$server/server.js"
cp -R dist/static "$output/static/static"

cat > "$server/.vc-config.json" <<'JSON'
{
  "runtime": "nodejs22.x",
  "handler": "server.js",
  "launcherType": "Nodejs",
  "framework": { "slug": "express" }
}
JSON

cat > "$output/config.json" <<'JSON'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/static/(.*)", "status": 404 },
    { "src": "/(.*)", "dest": "/server" }
  ]
}
JSON
