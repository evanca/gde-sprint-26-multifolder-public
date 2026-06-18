# brunch-content-data

Typed brunch theme content for the Brunch Club RSVP Kit.

`themes.json` is an array of brunch themes. Every entry must validate against
`brunch-shared-schema/brunch-theme.schema.json`. The `id` of each theme is the
cross-repo join key used by the frontend, the tests, and the docs.

## Dependency direction

```
brunch-shared-schema  ──▶  brunch-content-data  ──▶  brunch-frontend
                                     │                 brunch-tests
                                     └──────────────▶  brunch-docs
```

Add or edit themes here only after the schema permits the shape, and keep the
documentation and test fixtures in step.
