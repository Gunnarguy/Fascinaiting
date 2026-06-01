# Copilot Instructions for Fascinaiting

## Non-Negotiable Site Role

Fascinaiting.me is **The Platform** in Gunnar Hostetler's web ecosystem.

- **Gunnarguy.me** = The Creator: personal software engineer portfolio, case studies, professional identity.
- **Gunzino.me** = The Publisher: iOS app storefront, app support, privacy/legal endpoints, App Store user surfaces.
- **Fascinaiting.me** = The Platform: forward-facing AI orchestration brand for local AI engines, automated data pipelines, native software utilities, and raw product initiatives.

Do not collapse these roles into each other. Fascinaiting must not become a personal portfolio, App Store support portal, or random repo showcase.

## 10x Web UX Quality Bar

Act like a senior brand architect, product strategy director, and high-end front-end designer when touching the public surface.

- Keep the first three seconds brutally clear: Fascinaiting is the platform for AI orchestration, not a portfolio and not an app support page.
- Use high-contrast typography, strong hierarchy, restrained interaction, and premium minimalism.
- No corporate filler, no generic AI hype, no "revolutionizing", no vague product claims.
- Make every section justify its existence: hero, philosophy, product nodes, ecosystem separation, technical footer.
- Product cards should route only to polished public product surfaces, currently OpenIntelligence and OpenResponses.
- Every button/card/link needs stable responsive sizing, no mobile text overflow, and telemetry attributes.
- Do not ship unstyled HTML or stale asset URLs.

## Current Landing Page Contract

The main page should remain a clean, high-contrast, typography-led AI orchestration product platform.

Required structure:

1. Hero: title `Fascinaiting`, subheadline about high-agency systems orchestration, and CTA `Explore the Systems`.
2. Philosophy: `Built, Not Just Scripted.` two-column section explaining AI-assisted orchestration as real software execution, not filler.
3. Product nodes: only the polished outbound cards `OpenIntelligence` and `OpenResponses`.
4. Ecosystem section: clearly separates `Gunnarguy.me`, `Gunzino.me`, and `Fascinaiting.me`.
5. Footer/policy node: Systems Status, Developer Profile, Support Hub, Privacy Architecture.

## Forbidden Regressions

Never reintroduce the old OpenAssistant single-app page or the old repo-console/project-matrix page.

Before committing, sweep the shipped source for these strings and remove them if found outside historical docs/comments explicitly discussing old failures:

```bash
grep -RIn --exclude-dir=.git 'OpenAssistant - iOS App\|Repo Systems Showcase\|Presence Hub\|ORHub\|PushApp\|LinkedOut\|ChickenPlans\|DDG-PCT\|AudioCleanCheck\|VisionBud\|WarcraftLogs\|Classic Era\|terminal simulator' index.html app.js styles.css 404.html README.md
```

Expected result for active source files: no matches.

## Telemetry Rules

The GA4 property is `G-8CQD5KZ06Y`.

Every meaningful interactive element must include:

- `data-track`
- `data-track-group`
- `data-track-value` when the destination or product identity matters

Required event labels that must not disappear without replacing them intentionally:

- `hero_explore_click`
- `grid_openintelligence_click`
- `grid_openresponses_click`
- `footer_status_click`
- `footer_developer_profile_click`
- `footer_support_hub_click`
- `footer_privacy_architecture_click`

## Cache-Busting Rules

GitHub Pages and browsers can serve stale assets. Local CSS and JS references must use version query strings.

Current pattern:

```html
<link rel="stylesheet" href="styles.css?v=YYYYMMDDx" />
<script src="app.js?v=YYYYMMDDx"></script>
```

When changing `styles.css` or `app.js`, bump the token in both `index.html` and `app.js`'s `ASSET_VERSION`. If `404.html` references `styles.css`, bump it there too.

## Deployment Rules

Fascinaiting is hosted by GitHub Pages from `main` at `/` with custom domain `fascinaiting.me`.

Correct DNS state:

```text
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www Gunnarguy.github.io
```

Wrong/stale host to watch for:

```text
35.155.7.183
server: openresty
x-service: pixie-sh
```

If the public site serves stale content, do not start rewriting code until you compare:

```bash
dig +short fascinaiting.me A
curl -fsSL -H 'Cache-Control: no-cache' https://fascinaiting.me/ | grep -E -m 20 '<title>|AI Orchestration Platform|Repo Systems Showcase|OpenAssistant|ORHub|styles\.css|app\.js'
curl -fsSL --resolve fascinaiting.me:80:185.199.108.153 -H 'Cache-Control: no-cache' http://fascinaiting.me/ | grep -E -m 20 '<title>|AI Orchestration Platform|Repo Systems Showcase|OpenAssistant|ORHub|styles\.css|app\.js'
gh api repos/Gunnarguy/Fascinaiting/pages
```

## HTTPS Certificate Recovery

If DNS is correct but HTTPS fails with `CN=*.github.io` or GitHub says `The certificate does not exist yet`:

1. Verify DNS points to GitHub Pages, not Porkbun static hosting.
2. Check Pages config:
   ```bash
   gh api repos/Gunnarguy/Fascinaiting/pages
   ```
3. If the custom-domain cert is missing/stuck, reset the CNAME from GitHub Pages and set it back:
   ```bash
   gh api -X PUT repos/Gunnarguy/Fascinaiting/pages -f cname=''
   gh api -X PUT repos/Gunnarguy/Fascinaiting/pages -f cname='fascinaiting.me'
   ```
4. Wait for `https_certificate.state` to become `approved`.
5. Enable HTTPS enforcement:
   ```bash
   gh api -X PUT repos/Gunnarguy/Fascinaiting/pages -F https_enforced=true
   ```
6. Confirm:
   ```bash
   curl -vI https://fascinaiting.me/ 2>&1 | grep -E 'subject:|issuer:|SSL certificate verify ok|HTTP/'
   curl -sI http://fascinaiting.me/ | sed -n '1,20p'
   ```

GitHub's CNAME reset may create automatic commits like `Delete CNAME` and `Create CNAME`; after that, `git pull --ff-only origin main` to sync local state.

## Validation Checklist

Before finalizing site changes:

```bash
node --check app.js
git diff --check
grep -RIn --exclude-dir=.git 'OpenAssistant - iOS App\|Repo Systems Showcase\|Presence Hub\|ORHub\|PushApp\|LinkedOut\|ChickenPlans\|DDG-PCT\|AudioCleanCheck\|VisionBud\|WarcraftLogs\|Classic Era\|terminal simulator' index.html app.js styles.css 404.html README.md || true
curl -fsSL -H 'Cache-Control: no-cache' https://fascinaiting.me/ | grep -E -m 20 '<title>|AI Orchestration Platform|OpenIntelligence|OpenResponses|styles\.css|app\.js'
```

When the user asks whether it is live, answer from actual `curl`, DNS, Pages config, and certificate checks, not from GitHub commit state alone.
