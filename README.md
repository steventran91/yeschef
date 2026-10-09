# yeschef

A personal AI chef: a mobile-first web app for importing, organizing, searching, and cooking recipes, with an AI assistant layered on top.

Import a recipe from a photo or a URL, let AI clean and categorize it, then search your library by ingredients you have on hand, ask for substitutions or modifications, and eventually cook it step-by-step with an AI chef that knows your recipes and preferences.

## Status

🚧 In active development. Core recipe management, AI-powered import, ingredient search, and a tool-using AI chat are live; cook mode and chat-driven recipe discovery/import from the web are in progress.

## Features

- **Accounts** — email/password registration and login (JWT-based auth).
- **Recipe library** — full CRUD, each recipe with ingredients (with quantity/unit/prep/section/optional flags) and step-by-step instructions grouped by section, plus an interactive checklist view.
- **AI recipe import** — upload one or more photos of a recipe (e.g. a cookbook page or handwritten card) and have it extracted into structured, editable data via Claude, with a review step before saving.
- **Recipe images** — attach a photo of the dish once you've actually cooked it.
- **Archive, not delete** — recipes are soft-deleted, never silently lost.
- **Ingredient-based search** — find saved recipes by which ingredients you have on hand, ranked by match percentage, with optional ingredients excluded from matching.
- **AI chat** — a conversational AI chef (Claude) for general cooking/baking/cocktail questions and advice.
- **Chat tool-calling** — the chat AI can search your own saved recipes (by ingredient or by title/cuisine keyword) and surface them as clickable recipe cards, routing straight to the recipe's detail page.

## Stack

- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **AI:** Claude (Anthropic API) — structured extraction, conversational chat, and tool calling
- **Infra:** Docker

## Project structure

```
yeschef/
  backend/     FastAPI app, database models, services
  frontend/    Next.js (TypeScript) app
```

## Getting started

Setup instructions will be added once the project is ready for others to run locally.

## Roadmap

Next up: letting the chat AI search the web for new recipes (not just your saved ones) and preview/save them before cooking. Looking further ahead: a cook-mode experience with live, chat-driven recipe adjustments (substitutions, scaling) synced to an interactive checklist, plus personalization and pantry tracking.
