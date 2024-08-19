import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const emprunts = await prisma.emprunt.findMany({
      where: { user_id: Number(id as string) },
      include: {
        exemplaire: {
          include: {
            livre: true,
          },
        },
        user: true,
      },
    });
    return res.status(200).json(emprunts);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
