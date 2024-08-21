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
import AddModalSanction from "./_components/add-modal-sanction.component";
import { SanctionDataTable } from "./_components/sanction-data-table.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Sanction as PrismaSanction, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { HashLoader } from "react-spinners";

type Sanction = PrismaSanction & {
  user: User;
};

function SanctionsPage() {
  const { fetchData } = useFetchData<Sanction[]>("/api/sanctions");
  const {
    data: sanctions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sanctions"],
    queryFn: fetchData,
  });

  if (isError) return <div>Erreur: {error.message}</div>;
  return (
    <ContentLayout title="Sanctions">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sanctions</BreadcrumbPage>
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
                  <AddModalSanction />
                  <SanctionDataTable sanctions={sanctions ?? []} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

export default SanctionsPage;
