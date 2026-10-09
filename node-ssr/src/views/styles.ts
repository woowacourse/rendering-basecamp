import { readFileSync } from "fs";
import path from "path";

const STYLES_DIRECTORY = path.join(__dirname, "../../public/styles");
const IMPORT_RULE = /@import\s+['"](.+?)['"];/g;

const readStylesheet = (fileName: string) =>
  readFileSync(path.join(STYLES_DIRECTORY, fileName), "utf-8");

export const INLINE_STYLES = readStylesheet("index.css").replace(
  IMPORT_RULE,
  (_, importPath: string) => readStylesheet(importPath)
);
