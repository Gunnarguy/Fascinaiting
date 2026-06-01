#!/usr/bin/env bash
set -euo pipefail

domain="${1:-fascinaiting.me}"

echo "== DNS =="
dig +short "$domain" A
echo

echo "== GitHub Pages config =="
gh api repos/Gunnarguy/Fascinaiting/pages --jq '{status, cname, html_url, https_enforced, https_certificate}'
echo

echo "== Source sanity =="
node --check app.js
git diff --check
if grep -RIn --exclude-dir=.git 'OpenAssistant - iOS App\|Repo Systems Showcase\|Presence Hub\|ORHub\|PushApp\|LinkedOut\|ChickenPlans\|DDG-PCT\|AudioCleanCheck\|VisionBud\|WarcraftLogs\|Classic Era\|terminal simulator' index.html app.js styles.css 404.html README.md; then
  echo "Unexpected legacy source strings found." >&2
  exit 1
fi
echo "legacy string sweep: clean"
echo

echo "== HTTPS content =="
curl -fsSL -H 'Cache-Control: no-cache' "https://$domain/" \
  | grep -E -m 20 '<title>|AI Orchestration Platform|High-agency systems orchestration|Built, Not Just Scripted|OpenIntelligence|OpenResponses|styles\.css|app\.js'
echo

echo "== TLS =="
curl -vI "https://$domain/" 2>&1 \
  | grep -E 'subject:|issuer:|SSL certificate verify ok|HTTP/'
echo

echo "== HTTP redirect =="
curl -sI "http://$domain/" | sed -n '1,12p'