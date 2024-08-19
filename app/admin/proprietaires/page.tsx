"use client";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Proprietaire } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
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
import { ProprietaireDataTable } from "./_components/proprietaire-data-table.component";
import AddModalProprietaire from "./_components/add-modal-proprietaire.component";
import { ContentLayout } from "@/components/layouts/admin-panel/content-layout";

function ProprietairePage() {
  const proprietaire_data = useFetchData<Proprietaire[]>("/api/proprietaires");
  const {
    data: proprietaires,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["proprietaires"],
    queryFn: proprietaire_data.fetchData,
  });

  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <ContentLayout title="Propriétaires">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Propriétaires</BreadcrumbPage>
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
                  <AddModalProprietaire />
                  <ProprietaireDataTable proprietaires={proprietaires ?? []} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

export default ProprietairePage;
