// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  description: string;
  image_url: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({
    name: "Metadata name",
    description: "Metadata description",
    image_url: "https://s2.coinmarketcap.com/static/img/coins/200x200/7654.png",
  });
}
