import { renderDocument } from "./renderDocument";

export const renderNotFoundPage = () =>
  renderDocument({ name: "error", props: { message: "페이지를 찾을 수 없어요." } });

export const renderServerErrorPage = () =>
  renderDocument({
    name: "error",
    props: { message: "영화 정보를 불러오는데 실패했습니다." },
  });
