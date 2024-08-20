import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma-client";
import { subMonths } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Basic statistics
    const userCount = await prisma.user.count();
    const bookCount = await prisma.livre.count();
    const empruntCount = await prisma.emprunt.count();
    const sanctionCount = await prisma.sanction.count();

    // Emprunt statistics for the last 6 months
    const sixMonthsAgo = subMonths(new Date(), 6);
    const empruntData = await prisma.emprunt.groupBy({
      by: ["emprunt_date"],
      where: {
        emprunt_date: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        emprunt_id: true,
      },
      orderBy: {
        emprunt_date: "asc",
      },
    });

    const empruntStats = Array.from({ length: 6 }).map((_, index) => {
      const month = subMonths(new Date(), 5 - index);
      const monthKey = month.toLocaleString("en", { month: "long" });
      const empruntCount =
        empruntData.find(
          (data) => new Date(data.emprunt_date).getMonth() === month.getMonth()
        )?._count.emprunt_id || 0;

      return { month: monthKey, count: empruntCount };
    });

    // Top 10 most borrowed exemplaires
    const topExemplaires = await prisma.emprunt.groupBy({
      by: ["isbn"],
      _count: {
        emprunt_id: true,
      },
      orderBy: {
        _count: {
          emprunt_id: "desc",
        },
      },
      take: 10,
    });

    // Map the topExemplaires to include more details about the book
    const topExemplaireDetails = await Promise.all(
      topExemplaires.map(async (exemplaire) => {
        const details = await prisma.exemplaire.findUnique({
          where: { isbn: exemplaire.isbn },
          include: {
            livre: true, // Include book details
          },
        });
        return {
          isbn: exemplaire.isbn,
          count: exemplaire._count.emprunt_id,
          titre: details?.livre.titre,
          cote: details?.cote,
        };
      })
    );

    res.status(200).json({
      userCount,
      bookCount,
      empruntCount,
      sanctionCount,
      empruntStats,
      topExemplaires: topExemplaireDetails,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  } finally {
    await prisma.$disconnect();
  }
}
