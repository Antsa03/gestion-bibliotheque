"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { EmpruntDataTable } from "./_components/emprunt-data-table.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import {
  Exemplaire as PrismaExemplaire,
  Emprunt as PrismaEmprunt,
  User,
  Livre,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

type Emprunt = PrismaEmprunt & {
  user: User;
  exemplaire: Exemplaire;
};

function EmpruntPage() {
  // Récupération de la session
  const { data: session } = useSession();

  // Vérification si la session est définie
  const userId = session?.user_id;

  // Utilisation de useFetchData uniquement si userId est défini
  const { fetchData } = useFetchData<Emprunt[]>(
    userId ? `/api/adherent/emprunts?id=${userId}` : ""
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emprunts"],
    queryFn: userId ? fetchData : async () => [],
    enabled: !!userId, // La requête ne s'exécute que si userId est défini
  });

  if (isError) return <div>Erreur: {error.message}</div>;

  const emprunts = data ? data : [];

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Accueil</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Emprunts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <TableView /> */}
      <Card className="rounded-lg border-none mt-4">
        <CardContent className="p-2">
          <div className="flex justify-center items-center min-h-[cal(100vh-56px-64px-20px-24px-56px-48px)]">
            <div className="w-full p-2 min-h-[350px]">
              {isLoading ? (
                <div className="w-full h-[345px] flex items-center justify-center">
                  Chargement ...
                </div>
              ) : (
                <>
                  <h1>Historique de vos emprunts de livre</h1>
                  <EmpruntDataTable emprunts={emprunts} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default EmpruntPage;
