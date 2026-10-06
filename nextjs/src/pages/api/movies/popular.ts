import type { NextApiRequest, NextApiResponse } from 'next';
import { getPopularMovies } from '@/server/movies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      data: null,
      error: { status: 405, message: '지원하지 않는 요청입니다.' },
    });
  }

  const result = await getPopularMovies();

  return res.status(result.error?.status ?? 200).json(result);
}
