import fs from "fs";
import path from "path";

const STYLES_DIR = path.join(__dirname, "../../public/styles");

/**
 * index.css의 @import를 실제 파일 내용으로 바꿔 CSS 하나로 합친다.
 * 브라우저가 index.css를 받은 뒤 @import 파일을 다시 요청하는 연쇄 요청을 없애기 위해 사용한다.
 */
const buildCssBundle = () => {
  const entry = fs.readFileSync(path.join(STYLES_DIR, "index.css"), "utf-8");

  return entry.replace(/@import\s+['"](.+?)['"];/g, (_, file: string) =>
    fs.readFileSync(path.join(STYLES_DIR, file), "utf-8")
  );
};

// 서버가 시작될 때 한 번만 만들어 두고 재사용한다.
export const CSS_BUNDLE = buildCssBundle();
