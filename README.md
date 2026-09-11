# yeschef

A personal AI chef: a mobile-first web app for importing, organizing, searching, and cooking recipes, with an AI assistant layered on top.

Import a recipe from a photo or a URL, let AI clean and categorize it, then search your library by ingredients you have on hand, ask for substitutions or modifications, and eventually cook it step-by-step with an AI chef that knows your recipes and preferences.

## Status

🚧 Early development — Milestone 1 (project foundation). No features are implemented yet.

## Stack

- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** Next.js, React, TypeScript
- **AI:** LLM provider with structured output / tool calling
- **Infra:** Docker

## Project structure

```
yeschef/
  backend/     FastAPI app, database models, services
  frontend/    Next.js (TypeScript) app
```

## Getting started

Setup instructions will be added once the backend and frontend are scaffolded.

## Roadmap

Development follows staged milestones, starting with core recipe CRUD and import (screenshot/URL → AI extraction → save), then search, then an AI chef with tool use for recipe modification, substitution, and generation. Later milestones add cooking sessions, personalization, and pantry tracking.
