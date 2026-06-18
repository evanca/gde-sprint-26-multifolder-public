# brunch-frontend

The static, dependency-free RSVP surface for the Brunch Club RSVP Kit.

It renders one card per brunch theme with a mock, local-only RSVP control. There
is no backend, no account, and no real persistence.

## Cross-repo dependencies

The frontend reads from sibling repositories at runtime:

- `../brunch-shared-schema/brunch-theme.schema.json` and `validate.mjs` — the contract and its tiny validator.
- `../brunch-content-data/themes.json` — the theme data.

Because the frontend reaches across folders with relative paths, the five repos
must be served from a common parent so the browser can resolve `../`.

## Serving locally

From the `starter/` (or `reference/`) folder that contains all five repos:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/brunch-frontend/`.
