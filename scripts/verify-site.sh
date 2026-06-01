#!/usr/bin/env bash
set -euo pipefail

mode="${1:-all}"
domain="${2:-fascinaiting.me}"
repo_slug="Gunnarguy/Fascinaiting"
expected_cname="fascinaiting.me"
expected_branch="main"
expected_path="/"
legacy_pattern='OpenAssistant - iOS App|Repo Systems Showcase|Presence Hub|ORHub|PushApp|LinkedOut|ChickenPlans|DDG-PCT|AudioCleanCheck|VisionBud|WarcraftLogs|Classic Era|terminal simulator'

usage() {
  cat <<'EOF'
Usage: ./scripts/verify-site.sh [all|source|live|ci-live] [domain]

Modes:
  source   Run repository-only checks.
  live     Run DNS, Pages, deployed-content, TLS, and redirect checks.
  ci-live  Wait for the current commit's Pages build, then run live checks.
  all      Run source checks, then live checks.
EOF
}

section() {
  printf '== %s ==\n' "$1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  fi
}

lookup_a_records() {
  if command -v dig >/dev/null 2>&1; then
    dig +short "$domain" A
    return
  fi

  if command -v nslookup >/dev/null 2>&1; then
    nslookup -type=A "$domain" | awk '/^Address: / { print $2 }'
    return
  fi

  printf 'DNS lookup tool unavailable\n'
}

extract_first_match() {
  local file="$1"
  local regex="$2"

  extract_match_from_text "$(cat "$file")" "$regex" "$file"
}

extract_match_from_text() {
  local text="$1"
  local regex="$2"
  local source_label="${3:-input}"
  local match

  match="$(grep -Eo "$regex" <<<"$text" | head -n 1 || true)"
  if [[ -z "$match" ]]; then
    printf 'Failed to extract %s from %s\n' "$regex" "$source_label" >&2
    exit 1
  fi

  printf '%s\n' "$match"
}

assert_contains() {
  local haystack="$1"
  local needle="$2"

  if ! grep -Fq -- "$needle" <<<"$haystack"; then
    printf 'Expected to find "%s" in fetched content\n' "$needle" >&2
    exit 1
  fi
}

assert_not_contains() {
  local haystack="$1"
  local needle="$2"

  if grep -Fq -- "$needle" <<<"$haystack"; then
    printf 'Did not expect to find "%s" in fetched content\n' "$needle" >&2
    exit 1
  fi
}

git_file_text() {
  git show "$1:$2" 2>/dev/null || true
}

has_verify_diff_base() {
  [[ -n "${VERIFY_DIFF_BASE:-}" ]] || return 1
  git rev-parse -q --verify "${VERIFY_DIFF_BASE}^{commit}" >/dev/null 2>&1
}

diff_includes_file() {
  local file="$1"

  has_verify_diff_base || return 1
  git diff --name-only "$VERIFY_DIFF_BASE" HEAD -- "$file" | grep -q .
}

normalize_tokens() {
  sed -E 's/^.*\?v=//' | sed '/^$/d' | sort -u
}

single_token_from_worktree() {
  local regex="$1"
  shift
  local tokens
  local count

  tokens="$({
    local file
    for file in "$@"; do
      [[ -f "$file" ]] || continue
      grep -Eo "$regex" "$file" || true
    done
  } | normalize_tokens)"
  count="$(printf '%s\n' "$tokens" | sed '/^$/d' | wc -l | tr -d '[:space:]')"

  if [[ "$count" != "1" ]]; then
    printf 'Expected a single token for %s, found:\n%s\n' "$regex" "$tokens" >&2
    exit 1
  fi

  printf '%s\n' "$tokens"
}

single_token_at_ref() {
  local ref="$1"
  local regex="$2"
  shift 2
  local tokens
  local count

  tokens="$({
    local file
    for file in "$@"; do
      git show "$ref:$file" 2>/dev/null | grep -Eo "$regex" || true
    done
  } | normalize_tokens)"
  count="$(printf '%s\n' "$tokens" | sed '/^$/d' | wc -l | tr -d '[:space:]')"

  if [[ "$count" != "1" ]]; then
    printf 'Expected a single base token for %s at %s, found:\n%s\n' "$regex" "$ref" "$tokens" >&2
    exit 1
  fi

  printf '%s\n' "$tokens"
}

extract_asset_version_from_text() {
  local text="$1"
  local source_label="${2:-app.js}"
  local match

  match="$(grep -Eo 'ASSET_VERSION = "[^"]+"' <<<"$text" | head -n 1 || true)"
  if [[ -z "$match" ]]; then
    printf 'Failed to extract ASSET_VERSION from %s\n' "$source_label" >&2
    exit 1
  fi

  printf '%s\n' "$match" | sed -E 's/^[^"]*"//; s/"$//'
}

assert_group_token_bumped() {
  local asset_file="$1"
  local label="$2"
  local regex="$3"
  shift 3
  local current_token
  local base_token

  if ! diff_includes_file "$asset_file"; then
    printf '%s unchanged; skip\n' "$asset_file"
    return
  fi

  current_token="$(single_token_from_worktree "$regex" "$@")"
  base_token="$(single_token_at_ref "$VERIFY_DIFF_BASE" "$regex" "$@")"

  if [[ "$current_token" == "$base_token" ]]; then
    printf '%s changed but %s was not bumped (%s)\n' "$asset_file" "$label" "$current_token" >&2
    exit 1
  fi

  printf '%s bumped: %s -> %s\n' "$label" "$base_token" "$current_token"
}

gh_pages_field() {
  require_cmd gh
  gh api -H 'X-GitHub-Api-Version: 2022-11-28' "repos/$repo_slug/pages" --jq "$1"
}

gh_latest_build_field() {
  require_cmd gh
  gh api -H 'X-GitHub-Api-Version: 2022-11-28' "repos/$repo_slug/pages/builds/latest" --jq "$1"
}

fetch_body() {
  curl -fsSL --retry 3 --retry-all-errors -H 'Cache-Control: no-cache' "$1"
}

https_headers() {
  curl -fsSI --retry 3 --retry-all-errors "$1"
}

http_headers() {
  curl -sSI --retry 3 --retry-all-errors "$1"
}

run_source_checks() {
  local styles_ref
  local app_ref
  local ga_count

  section "Source sanity"
  node --check app.js
  git diff --check

  if grep -RIn --exclude-dir=.git "$legacy_pattern" index.html app.js styles.css 404.html README.md; then
    printf 'Unexpected legacy source strings found.\n' >&2
    exit 1
  fi

  styles_ref="$(extract_first_match index.html 'styles\.css\?v=[^"]+')"
  app_ref="$(extract_first_match index.html 'app\.js\?v=[^"]+')"
  ga_count="$(grep -c 'googletagmanager.com/gtag/js?id=G-8CQD5KZ06Y' index.html || true)"

  [[ "$ga_count" == "1" ]] || {
    printf 'Expected exactly one GA tag in index.html, found %s\n' "$ga_count" >&2
    exit 1
  }

  printf 'legacy string sweep: clean\n'
  printf 'styles ref: %s\n' "$styles_ref"
  printf 'app ref: %s\n\n' "$app_ref"

  run_asset_bump_checks
}

run_asset_bump_checks() {
  local styles_token
  local app_token
  local runtime_token
  local base_runtime_token

  section "Asset version bumps"
  styles_token="$(single_token_from_worktree 'styles\.css\?v=[^"]+' index.html 404.html)"
  app_token="$(single_token_from_worktree 'app\.js\?v=[^"]+' index.html)"
  runtime_token="$(extract_asset_version_from_text "$(cat app.js)" app.js)"

  [[ "$styles_token" == "$runtime_token" ]] || {
    printf 'styles.css token (%s) does not match app.js ASSET_VERSION (%s)\n' "$styles_token" "$runtime_token" >&2
    exit 1
  }
  [[ "$app_token" == "$runtime_token" ]] || {
    printf 'app.js token (%s) does not match app.js ASSET_VERSION (%s)\n' "$app_token" "$runtime_token" >&2
    exit 1
  }

  printf 'styles.css token: %s\n' "$styles_token"
  printf 'app.js token: %s\n' "$app_token"
  printf 'ASSET_VERSION: %s\n' "$runtime_token"

  if ! has_verify_diff_base; then
    printf '\n'
    return
  fi

  assert_group_token_bumped "styles.css" 'styles.css token' 'styles\.css\?v=[^"]+' index.html 404.html
  assert_group_token_bumped "app.js" 'app.js token' 'app\.js\?v=[^"]+' index.html

  if diff_includes_file "app.js"; then
    base_runtime_token="$(extract_asset_version_from_text "$(git_file_text "$VERIFY_DIFF_BASE" app.js)" "app.js@$VERIFY_DIFF_BASE")"
    if [[ "$runtime_token" == "$base_runtime_token" ]]; then
      printf 'app.js changed but ASSET_VERSION was not bumped (%s)\n' "$runtime_token" >&2
      exit 1
    fi
    printf 'ASSET_VERSION bumped: %s -> %s\n' "$base_runtime_token" "$runtime_token"
  else
    printf 'app.js unchanged; skip\n'
  fi

  printf '\n'
}

run_pages_checks() {
  local status
  local cname
  local https_enforced
  local https_state
  local source_branch
  local source_path

  section "GitHub Pages config"
  gh api -H 'X-GitHub-Api-Version: 2022-11-28' "repos/$repo_slug/pages" \
    --jq '{status, cname, html_url, https_enforced, https_certificate, source}'

  status="$(gh_pages_field '.status')"
  cname="$(gh_pages_field '.cname')"
  https_enforced="$(gh_pages_field '.https_enforced')"
  https_state="$(gh_pages_field '.https_certificate.state')"
  source_branch="$(gh_pages_field '.source.branch')"
  source_path="$(gh_pages_field '.source.path')"

  [[ "$status" == "built" ]] || {
    printf 'Expected Pages status built, found %s\n' "$status" >&2
    exit 1
  }
  [[ "$cname" == "$expected_cname" ]] || {
    printf 'Expected Pages cname %s, found %s\n' "$expected_cname" "$cname" >&2
    exit 1
  }
  [[ "$https_enforced" == "true" ]] || {
    printf 'Expected https_enforced=true, found %s\n' "$https_enforced" >&2
    exit 1
  }
  [[ "$https_state" == "approved" ]] || {
    printf 'Expected https_certificate.state=approved, found %s\n' "$https_state" >&2
    exit 1
  }
  [[ "$source_branch" == "$expected_branch" ]] || {
    printf 'Expected Pages branch %s, found %s\n' "$expected_branch" "$source_branch" >&2
    exit 1
  }
  [[ "$source_path" == "$expected_path" ]] || {
    printf 'Expected Pages path %s, found %s\n' "$expected_path" "$source_path" >&2
    exit 1
  }

  printf '\n'
}

wait_for_pages_build() {
  local expected_commit
  local latest_commit
  local latest_status
  local latest_error
  local attempts
  local sleep_seconds

  expected_commit="${GITHUB_SHA:-$(git rev-parse HEAD)}"
  attempts="${PAGES_BUILD_ATTEMPTS:-40}"
  sleep_seconds="${PAGES_BUILD_SLEEP_SECONDS:-15}"

  section "Wait for Pages build"
  printf 'expected commit: %s\n' "$expected_commit"

  while (( attempts > 0 )); do
    latest_commit="$(gh_latest_build_field '.commit')"
    latest_status="$(gh_latest_build_field '.status')"
    latest_error="$(gh_latest_build_field '.error.message // ""')"

    printf 'latest commit=%s status=%s\n' "$latest_commit" "$latest_status"

    if [[ "$latest_commit" == "$expected_commit" ]]; then
      case "$latest_status" in
        built)
          printf '\n'
          return 0
          ;;
        errored|error|failed|canceled)
          if [[ -n "$latest_error" ]]; then
            printf 'Pages build error: %s\n' "$latest_error" >&2
          fi
          exit 1
          ;;
      esac
    fi

    attempts=$((attempts - 1))
    if (( attempts == 0 )); then
      printf 'Timed out waiting for GitHub Pages to build commit %s\n' "$expected_commit" >&2
      exit 1
    fi

    sleep "$sleep_seconds"
  done
}

run_live_checks() {
  local root_html
  local title
  local styles_ref
  local app_ref

  title="$(extract_first_match index.html '<title>[^<]+')"
  title="${title#<title>}"
  styles_ref="$(extract_first_match index.html 'styles\.css\?v=[^"]+')"
  app_ref="$(extract_first_match index.html 'app\.js\?v=[^"]+')"

  section "DNS"
  lookup_a_records
  printf '\n'

  root_html="$(fetch_body "https://$domain/")"

  section "HTTPS content"
  assert_contains "$root_html" "$title"
  assert_contains "$root_html" "$styles_ref"
  assert_contains "$root_html" "$app_ref"
  assert_contains "$root_html" 'High-agency systems orchestration'
  assert_contains "$root_html" 'Built, Not Just Scripted.'
  assert_contains "$root_html" 'OpenIntelligence'
  assert_contains "$root_html" 'OpenResponses'
  assert_contains "$root_html" 'G-8CQD5KZ06Y'
  assert_not_contains "$root_html" 'Repo Systems Showcase'
  assert_not_contains "$root_html" 'OpenAssistant - iOS App'
  assert_not_contains "$root_html" 'Presence Hub'

  printf '%s\n' "$root_html" | grep -E -m 20 '<title>|AI Orchestration Platform|High-agency systems orchestration|Built, Not Just Scripted|OpenIntelligence|OpenResponses|styles\.css|app\.js'
  printf '\n'
}

run_tls_checks() {
  section "TLS"
  echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates
  https_headers "https://$domain/" | sed -n '1,12p'
  printf '\n'
}

run_redirect_checks() {
  local headers

  section "HTTP redirect"
  headers="$(http_headers "http://$domain/")"
  printf '%s\n' "$headers" | sed -n '1,12p'
  printf '%s\n' "$headers" | grep -qi '^location: https://'
  printf '\n'
}

run_live_suite() {
  run_pages_checks
  run_live_checks
  run_tls_checks
  run_redirect_checks
}

case "$mode" in
  source)
    run_source_checks
    ;;
  live)
    run_live_suite
    ;;
  ci-live)
    run_pages_checks
    wait_for_pages_build
    run_live_checks
    run_tls_checks
    run_redirect_checks
    ;;
  all)
    run_source_checks
    run_live_suite
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac
