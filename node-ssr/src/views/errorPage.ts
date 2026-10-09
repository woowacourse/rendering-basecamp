import { SITE_NAME } from "../constants/site";
import { renderDocument } from "./document";

export const renderErrorPage = () =>
  renderDocument({
    title: SITE_NAME,
    body: /*html*/ `<div>영화 정보를 불러오는데 실패했습니다.</div>`,
  });
