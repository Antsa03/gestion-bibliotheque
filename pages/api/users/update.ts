import prisma from "@/lib/prisma-client";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT")
      return res.status(401).json("Méthode non autorisé");
    const user: User = req.body;
    const update_user = await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        name: user.name,
        firstname: user.firstname,
        address: user.address,
        phone: user.phone,
        role: user.role,
        email: user.email,
      },
    });
    return res.status(200).json(update_user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
