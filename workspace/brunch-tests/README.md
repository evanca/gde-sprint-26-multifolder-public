# brunch-tests

Contract tests for the Brunch Club RSVP Kit. They use only Node's built-in test
runner — no external dependencies.

`themes.test.js` validates `brunch-content-data/themes.json` against
`brunch-shared-schema/brunch-theme.schema.json` (via the shared `validate.mjs`),
checks the expected theme-id fixture, and confirms the validator rejects a
contract break. `package.json` sets `"type": "module"` so the `.js` test files
run as ES modules.

## Running

From this folder:

```bash
node --test
```

The tests reach the schema and content repos with relative paths, so keep the
five repos together under a common parent.
