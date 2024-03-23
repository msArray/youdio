import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${req.query.vid}`;
  const meta = await ytdl.getInfo(youtubeUrl);
  res.json({
    title: meta.videoDetails.title,
    video:meta.formats.find((f) => f.mimeType === 'video/mp4; codecs="avc1.64002a"')?.url,
    videoFull: meta.formats.find((f) => f.mimeType === 'video/mp4; codecs="avc1.42001E, mp4a.40.2"')?.url,
  });
}
