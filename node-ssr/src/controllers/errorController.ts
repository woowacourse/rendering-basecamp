import { errorPage } from "../views/pages";
import { PageResponse } from "./types";

export const notFoundController = (): PageResponse => ({
  status: 404,
  html: errorPage(404, "페이지를 찾을 수 없습니다."),
});

export const serverErrorController = (error: unknown): PageResponse => {
  console.error(error);
  return {
    status: 500,
    html: errorPage(500, "영화 정보를 불러오는 중 문제가 발생했습니다."),
  };
};
