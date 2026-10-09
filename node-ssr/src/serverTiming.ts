import { Response } from "express";

const SLOW_THRESHOLD_MS = 100;

export const withServerTiming = async <T>(res: Response, metric: string, task: () => Promise<T>) => {
  const startedAt = performance.now();
  const result = await task();
  const duration = performance.now() - startedAt;

  res.append("Server-Timing", `${metric};dur=${duration.toFixed(1)}`);

  if (duration > SLOW_THRESHOLD_MS) {
    console.warn(`${metric} 응답에 ${Math.round(duration)}ms가 걸렸습니다. (기준 ${SLOW_THRESHOLD_MS}ms)`);
  }

  return result;
};
