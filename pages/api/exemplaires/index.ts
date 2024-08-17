import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const exemplaires = await prisma.exemplaire.findMany({
      include: {
        livre: true,
      },
    });
    return res.status(200).json(exemplaires);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
