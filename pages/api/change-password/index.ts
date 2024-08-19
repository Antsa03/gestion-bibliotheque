import prisma from "@/lib/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const { id, password } = req.body;
    const change_password = await prisma.user.update({
      where: { user_id: id },
      data: {
        password: await bcryptjs.hash(password, 10),
      },
    });
    return res.status(200).json(change_password);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
