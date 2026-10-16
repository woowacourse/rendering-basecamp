import { Router, Request, Response } from "express";
import { isAxiosError } from "axios";

import { apiClient } from "../../client/lib/apiClient";

const router = Router();

router.get("/*path", async (req: Request, res: Response) => {
  try {
    const response = await apiClient.get(req.url);
    res.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
      return;
    }
    res.status(500).json({ message: "영화 정보를 불러오는데 실패했습니다." });
  }
});

export default router;
