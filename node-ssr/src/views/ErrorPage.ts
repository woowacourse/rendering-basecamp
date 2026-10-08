import { escapeHtml } from "../utils/escapeHtml";
import { renderLayout } from "./layout";

export const renderErrorPage = (message: string) =>
  renderLayout({
    title: "영화 리뷰",
    body: /*html*/ `<div>${escapeHtml(message)}</div>`,
  });
