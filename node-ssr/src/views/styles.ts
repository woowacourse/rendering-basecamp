import fs from "fs";
import path from "path";

const STYLES_DIR = path.join(__dirname, "../../public/styles");

// public/styles/index.css의 @import 순서와 같게 유지한다.
const CSS_FILES = [
  "reset.css",
  "colors.css",
  "text.css",
  "main.css",
  "thumbnail.css",
  "modal.css",
  "animation.css",
  "media.css",
];

/**
 * 서버가 시작할 때 CSS 파일들을 한 번 읽어서 하나의 문자열로 합쳐 둔다.
 */
export const INLINE_CSS = CSS_FILES.map((file) =>
  fs.readFileSync(path.join(STYLES_DIR, file), "utf-8"),
).join("\n");
