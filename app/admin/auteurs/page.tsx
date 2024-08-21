"use client";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Auteur } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
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
import AddModalAuteur from "./_components/add-modal-auteur.component";
import { AuteurDataTable } from "./_components/auteur-data-table.component";
import { HashLoader } from "react-spinners";

function AuteurPage() {
  const auteur_data = useFetchData<Auteur[]>("/api/auteurs");
  const {
    data: auteurs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auteurs"],
    queryFn: auteur_data.fetchData,
  });

  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <ContentLayout title="Auteurs">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Auteurs</BreadcrumbPage>
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
                  <HashLoader />
                </div>
              ) : (
                <>
                  <AddModalAuteur />
                  <AuteurDataTable auteurs={auteurs ?? []} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

export default AuteurPage;
