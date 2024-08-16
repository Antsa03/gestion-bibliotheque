import prisma from "@/lib/prisma-client";
import { Sanction } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sanction: Sanction = req.body;
    const create_sanction = await prisma.sanction.update({
      where: { sanction_id: sanction.sanction_id },
      data: {
        sanction_deb: new Date(sanction.sanction_deb),
        sanction_fin: new Date(sanction.sanction_fin),
        sanction_motif: sanction.sanction_motif,
        user_id: sanction.user_id,
      },
    });
    return res.status(200).json(create_sanction);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
