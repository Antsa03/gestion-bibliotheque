"use client";
import React from "react";
import { ContentLayout } from "@/components/layouts/admin-panel/content-layout";
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
import AddModalEmprunt from "./_components/add-modal-emprunt.component";
import { EmpruntDataTable } from "./_components/emprunt-data-table.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import {
  Exemplaire as PrismaExemplaire,
  Emprunt as PrismaEmprunt,
  User,
  Livre,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

type Emprunt = PrismaEmprunt & {
  user: User;
  exemplaire: Exemplaire;
};

function EmpruntPage() {
  const { fetchData } = useFetchData<Emprunt[]>("/api/emprunts");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emprunts"],
    queryFn: fetchData,
  });

  if (isError) return <div>Erreur: {error.message}</div>;

  const emprunts = data ? data : [];

  return (
    <ContentLayout title="Emprunts">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
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
                  <AddModalEmprunt />
                  <EmpruntDataTable emprunts={emprunts} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

export default EmpruntPage;
