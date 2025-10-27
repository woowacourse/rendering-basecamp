import { renderToString } from "react-dom/server";
import { generateHTML } from "./generateHTML";

interface RenderOptions {
  appHTML: string;
  ogTags: string;
  initialData: Record<string, unknown>;
}

export function renderPage({ appHTML, ogTags, initialData }: RenderOptions) {
  const template = generateHTML();

  return template
    .replace("<!--{OG_TAGS}-->", ogTags)
    .replace(
      "<!--{INIT_DATA_AREA}-->",
      `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
    )
    .replace("<!--{BODY_AREA}-->", appHTML);
}
