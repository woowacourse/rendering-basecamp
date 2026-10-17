import type { Response } from "express";

export const withServerTiming = async <T>(
  res: Response,
  metric: string,
  task: () => T | Promise<T>
) => {
  const startedAt = performance.now();
  try {
    return await task();
  } finally {
    const duration = performance.now() - startedAt;
    res.append("Server-Timing", `${metric};dur=${duration.toFixed(1)}`);
  }
};
