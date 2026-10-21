import { Router, Request, Response } from 'express';

import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import React from 'react';
import { routes } from '../../router';
import Document from '../../client/Document';

const router = Router();

routes.forEach((route) => {
    router.get(route.path, async (req: Request, res: Response) => {
        const data = await route.loader(req.params);

        const renderedApp = renderToString(
            <Document initialData={data}>
                <App initialPathname={req.path} initialData={data} />
            </Document>
        );
        res.send(`<!DOCTYPE html> ${renderedApp}`);
    });
});

export default router;
