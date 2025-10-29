import { Router } from "express";
import movieRouter from "./movie";
import detailRouter from "./detail";

const router = Router();

router.use("/", movieRouter);
router.use("/detail", detailRouter);

export default router;
