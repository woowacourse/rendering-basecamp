import type { Page } from "./App";

const INITIAL_DATA_ELEMENT_ID = "__INITIAL_DATA__";

export const serializeInitialData = (page: Page) => {
  const json = JSON.stringify(page).replace(/</g, "\\u003c");
  return `<script id="${INITIAL_DATA_ELEMENT_ID}" type="application/json">${json}</script>`;
};

export const readInitialData = (): Page => {
  const element = document.getElementById(INITIAL_DATA_ELEMENT_ID);
  return JSON.parse(element.textContent);
};
