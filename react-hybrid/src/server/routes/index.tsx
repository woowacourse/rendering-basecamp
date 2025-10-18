import dotenv from "dotenv";
dotenv.config();

import { Router, type Request, type Response } from "express";
import { renderToPipeableStream } from "react-dom/server";

import App from "../../client/App";
import { matchRoute } from "../utils/matchRoute";
import { routes } from "../../client/routes";
import { getCurrentUrlByRequest } from "../utils/getCurrentUrlByRequest";

export type GetServerDataParams = {
  [key: string]: string;
  currentUrl: string;
};

const render = async (req: Request, res: Response) => {
  const matched = matchRoute(req.path);

  if (!matched) {
    res.statusCode = 404;
    res.send("매칭된 라우트가 존재하지 않습니다.");
    return;
  }

  const { route, params } = matched;

  const currentUrl = getCurrentUrlByRequest(req);
  const serverData = route.getServerData
    ? await route.getServerData({ ...params, currentUrl })
    : null;

  const { pipe } = renderToPipeableStream(
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
      </head>
      <body>
        <div id="root">
          <App Component={route.component} props={serverData} />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `  
              window.__INITIAL_DATA__ = ${JSON.stringify({
                path: route.path,
                props: serverData,
              })}  
            `,
          }}
        />
      </body>
    </html>,
    {
      bootstrapScripts: ["/static/bundle.js"],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader("Content-type", "text/html");
        pipe(res);
      },
      onShellError(error) {
        res.statusCode = 500;
        res.send("<!doctype html><p>Error</p>");
      },
      onError(error) {
        console.error(error);
      },
    }
  );
};

const router = Router();

routes.forEach((route) => {
  router.get(route.path, (req: Request, res: Response) => {
    render(req, res);
  });
});

export default router;
