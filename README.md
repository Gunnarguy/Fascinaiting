# Fascinaiting.me // AI Orchestration Platform

This repository hosts the static frontend for **[fascinaiting.me](https://fascinaiting.me)**, Gunnar Hostetler's forward-facing AI orchestration brand for local AI engines, automated data pipelines, and native software utilities.

## Purpose

Fascinaiting is the platform node in the ecosystem:

- **Gunnarguy.me** is the creator profile and professional portfolio.
- **Gunzino.me** is the publisher site for product pages, support, and privacy/legal surfaces.
- **Fascinaiting.me** is the product and AI orchestration brand.

## Landing Page Structure

- **Hero:** Bold first-screen positioning for high-agency systems orchestration.
- **Philosophy:** Two-column breakdown of building real software with AI-assisted orchestration instead of bloated demos.
- **Product Nodes:** Focused cards for OpenIntelligence and OpenResponses as outbound app/product funnels.
- **Ecosystem Matrix:** Clear separation between creator, publisher, and platform web properties.
- **Technical Footer:** Systems status, developer profile, support hub, and privacy architecture links.

## Telemetry

Every meaningful button, link, and product card uses `data-track`, `data-track-group`, and where useful `data-track-value` attributes. The shared GA4 click listener in `index.html` captures these interactions as `ui_interaction_event`.

## Stack

- **Core:** Static HTML5.
- **Style:** Vanilla CSS with high-contrast typography and responsive layouts.
- **Interactivity:** Small vanilla JavaScript helper for cache-busting stylesheets, smooth scroll, and reveal states.
- **Deployment:** GitHub Pages with custom CNAME domain.
