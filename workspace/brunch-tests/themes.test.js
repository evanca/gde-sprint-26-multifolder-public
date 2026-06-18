import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateThemes } from "../brunch-shared-schema/validate.mjs";

const schema = JSON.parse(
  await readFile(new URL("../brunch-shared-schema/brunch-theme.schema.json", import.meta.url), "utf8")
);
const themes = JSON.parse(
  await readFile(new URL("../brunch-content-data/themes.json", import.meta.url), "utf8")
);
// External, read-only design tokens. We only READ this file to confirm each
// theme's accent is a real Open Color token; the kit never modifies it.
const openColor = await readFile(
  new URL("../open-color/open-color.css", import.meta.url), "utf8"
);

// Fixture: the ids the rest of the kit (frontend, docs) is expected to render.
const EXPECTED_IDS = ["garden-citrus-table", "cozy-cocoa-corner", "harbor-greens-brunch"];

test("content data validates against the shared schema", () => {
  assert.deepEqual(validateThemes(themes, schema), []);
});

test("content data contains the expected theme ids", () => {
  assert.deepEqual(themes.map((theme) => theme.id), EXPECTED_IDS);
});

test("theme ids are unique", () => {
  const ids = themes.map((theme) => theme.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every theme has at least one menu item and seats", () => {
  for (const theme of themes) {
    assert.ok(theme.menu.length >= 1, `${theme.id} needs a menu`);
    assert.ok(theme.capacity >= 1, `${theme.id} needs capacity`);
  }
});

test("every theme accent is a real Open Color token", () => {
  for (const theme of themes) {
    assert.ok(
      openColor.includes(`${theme.accent}:`),
      `${theme.id}: accent "${theme.accent}" is not defined in open-color (external, read-only)`
    );
  }
});

test("the validator rejects a contract break", () => {
  const broken = [{ ...themes[0], capacity: 0, accent: "not-a-token", surprise: true }];
  const errors = validateThemes(broken, schema);
  assert.ok(errors.some((message) => message.includes("capacity")));
  assert.ok(errors.some((message) => message.includes("accent")));
  assert.ok(errors.some((message) => message.includes("surprise")));
});
