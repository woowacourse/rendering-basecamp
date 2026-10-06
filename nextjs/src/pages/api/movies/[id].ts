import type { NextApiRequest, NextApiResponse } from 'next';
import { getMovieDetail } from '@/server/movies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      data: null,
      error: { status: 405, message: '지원하지 않는 요청입니다.' },
    });
  }

  const { id } = req.query;

  if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      data: null,
      error: { status: 400, message: '올바른 영화 ID가 필요합니다.' },
    });
  }

  const result = await getMovieDetail(id);

  return res.status(result.error?.status ?? 200).json(result);
}
