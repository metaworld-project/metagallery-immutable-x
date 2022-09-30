// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = decodeURIComponent(req.query.url as string);
  return axios
    .get(url, {
      responseType: "stream",
    })
    .then((response) => {
      // Enable cors
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
      res.setHeader("Content-Type", response.headers["content-type"]);
      response.data.pipe(res);
    });
}
