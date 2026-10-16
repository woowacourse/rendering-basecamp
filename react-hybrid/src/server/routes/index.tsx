import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { matchRoute } from '../../router';
import Document from '../../client/Document';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { route, params } = matchRoute(req.path);
    const data = await route.loader(params);

    const renderedApp = renderToString(
        <Document initialData={data}>
            <App initialPathname={req.path} initialData={data} />
        </Document>
    );
    res.send(`<!DOCTYPE html> ${renderedApp}`);
});

router.get('/detail/:id', async (req: Request, res: Response) => {
    const { route, params } = matchRoute(req.path);
    const data = await route.loader(params);

    const renderedApp = renderToString(
        <Document initialData={data}>
            <App initialPathname={req.path} initialData={data} />
        </Document>
    );
    res.send(`<!DOCTYPE html> ${renderedApp}`);
});

export default router;
