import { Router } from "express";
import { getDetailPage, getHomePage } from "../controllers";

const router = Router();

router.get("/", getHomePage);
router.get("/detail/:id", getDetailPage);

export default router;
