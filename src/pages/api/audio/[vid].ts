import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${req.query.vid}`;
  res.setHeader("Content-Type", "audio/mpeg");
  ytdl(youtubeUrl, { quality: "highestaudio", dlChunkSize: 1024000 }).pipe(res);
}
