// Tiny dependency-free validator for the Brunch Theme Contract.
// Shared by brunch-frontend (in the browser) and brunch-tests (in Node).
// It checks only the rules this kit relies on, not the full JSON Schema spec.

export function validateThemes(themes, schema) {
  const errors = [];
  if (!Array.isArray(themes)) {
    return ["root: expected an array of themes"];
  }
  const itemSchema = schema.items;
  const allowed = Object.keys(itemSchema.properties);
  const seen = new Set();

  themes.forEach((theme, index) => {
    const where = `themes[${index}]`;
    if (typeof theme !== "object" || theme === null || Array.isArray(theme)) {
      errors.push(`${where}: expected an object`);
      return;
    }
    for (const field of itemSchema.required) {
      if (!(field in theme)) errors.push(`${where}: missing required field "${field}"`);
    }
    if (itemSchema.additionalProperties === false) {
      for (const field of Object.keys(theme)) {
        if (!allowed.includes(field)) errors.push(`${where}: unexpected field "${field}"`);
      }
    }
    const { id, name, tagline, host, capacity, menu } = theme;
    if (typeof id === "string") {
      if (!/^[a-z0-9-]+$/.test(id)) errors.push(`${where}.id: must be kebab-case`);
      if (seen.has(id)) errors.push(`${where}.id: duplicate id "${id}"`);
      seen.add(id);
    } else {
      errors.push(`${where}.id: expected string`);
    }
    for (const [field, value] of [["name", name], ["tagline", tagline], ["host", host]]) {
      if (typeof value !== "string" || value.length < 1) {
        errors.push(`${where}.${field}: expected non-empty string`);
      }
    }
    if (!Number.isInteger(capacity) || capacity < 1) {
      errors.push(`${where}.capacity: expected integer >= 1`);
    }
    if (!Array.isArray(menu) || menu.length < 1) {
      errors.push(`${where}.menu: expected non-empty array`);
    } else if (!menu.every((item) => typeof item === "string" && item.length > 0)) {
      errors.push(`${where}.menu: expected non-empty strings`);
    }
    if (typeof theme.accent !== "string" || !/^--[a-z0-9-]+$/.test(theme.accent)) {
      errors.push(`${where}.accent: expected an Open Color token name like "--oc-pink-2"`);
    }
  });

  return errors;
}
