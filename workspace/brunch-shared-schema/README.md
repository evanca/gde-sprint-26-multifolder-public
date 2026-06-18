# brunch-shared-schema

The shared contract repository for the Brunch Club RSVP Kit.

`brunch-theme.schema.json` defines the single source of truth for a brunch
theme. Every other repository depends on this contract:

- `brunch-content-data` must produce data that validates against it.
- `brunch-frontend` reads only the fields declared here.
- `brunch-tests` validates content against this schema.
- `brunch-docs` documents the fields described here.

## The contract

Each theme is an object with these required fields:

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable kebab-case key (`^[a-z0-9-]+$`). The cross-repo join key. |
| `name` | string | Display name. |
| `tagline` | string | Short one-line description. |
| `host` | string | Person hosting the brunch. |
| `capacity` | integer ≥ 1 | Number of RSVP seats. |
| `menu` | string[] (≥ 1) | Dishes served. |

`additionalProperties` is `false`. Adding a field anywhere downstream without
extending this schema first is a contract break.

## Changing the contract

When a theme needs a new field, extend this schema **first**, then propagate the
change to content, frontend, tests, and docs. Tracing that chain is the lesson
of this codelab.
