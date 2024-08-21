import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const livres = await prisma.livre.findMany({
      take: 5,
      orderBy: {
        livre_id: "desc",
      },
    });

    return res.status(200).json(livres);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
