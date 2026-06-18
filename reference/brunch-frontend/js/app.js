import { validateThemes } from "../../brunch-shared-schema/validate.mjs";

const SCHEMA_URL = "../brunch-shared-schema/brunch-theme.schema.json";
const DATA_URL = "../brunch-content-data/themes.json";

const grid = document.querySelector("#theme-grid");
const resultCount = document.querySelector("#result-count");
const errorBox = document.querySelector("#error");

// RSVP state is mock and local-only: it lives in memory for this session.
const rsvps = new Map();

function showError(message) {
  errorBox.hidden = false;
  errorBox.textContent = message;
  resultCount.textContent = "0 themes";
  grid.innerHTML = "";
}

function seatsLabel(theme) {
  const taken = rsvps.get(theme.id) ? 1 : 0;
  return `${theme.capacity - taken} of ${theme.capacity} seats open`;
}

function render(themes) {
  resultCount.textContent = `${themes.length} themes`;
  grid.innerHTML = themes.map((theme) => `
    <article class="theme-card" style="--card-accent: var(${theme.accent});">
      <h2>${theme.name}</h2>
      <p class="tagline">${theme.tagline}</p>
      <p class="host">Hosted by ${theme.host}</p>
      <ul>${theme.menu.map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="rsvp">
        <span class="seats" data-seats="${theme.id}">${seatsLabel(theme)}</span>
        <button type="button" data-rsvp="${theme.id}" aria-pressed="false">RSVP</button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("button[data-rsvp]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.rsvp;
      const theme = themes.find((item) => item.id === id);
      const next = !rsvps.get(id);
      rsvps.set(id, next);
      button.setAttribute("aria-pressed", String(next));
      button.textContent = next ? "Cancel RSVP" : "RSVP";
      grid.querySelector(`[data-seats="${id}"]`).textContent = seatsLabel(theme);
    });
  });
}

async function load() {
  try {
    const [schema, themes] = await Promise.all([
      fetch(SCHEMA_URL).then((response) => response.json()),
      fetch(DATA_URL).then((response) => response.json())
    ]);
    const errors = validateThemes(themes, schema);
    if (errors.length > 0) {
      showError(`Theme data does not match the shared contract: ${errors[0]}`);
      return;
    }
    render(themes);
  } catch (cause) {
    showError("Could not load brunch themes. Check that the sibling repos are served together.");
  }
}

load();
