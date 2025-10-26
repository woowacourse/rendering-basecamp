import { Router } from "express";
import { getDetailPage, getHomePage } from "../ssr/controllers/movieController";

const router = Router();

router.get("/", getHomePage);
router.get("/detail/:id", getDetailPage);

export default router;
