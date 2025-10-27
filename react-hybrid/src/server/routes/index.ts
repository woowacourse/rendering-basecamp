import { Router } from "express";
import detailRouter from './detail';
import homeRouter from './home';

const router = Router();

router.use("/", homeRouter);
router.use("/detail", detailRouter);

export default router;
