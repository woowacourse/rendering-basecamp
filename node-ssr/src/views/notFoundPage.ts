import { SITE_NAME } from "../constants/site";
import { renderDocument } from "./document";

export const renderNotFoundPage = () =>
  renderDocument({
    title: `페이지를 찾을 수 없어요 | ${SITE_NAME}`,
    body: /*html*/ `<div>페이지를 찾을 수 없어요.</div>`,
  });
