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
import AddUserComponent from "./_components/add-user.component";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { User } from "@prisma/client";
import { UserDataTable } from "./_components/user-data-table.component";
import Link from "next/link";
import { HashLoader } from "react-spinners";

function UserPage() {
  //Logique de listage
  const { fetchData } = useFetchData<User[]>("/api/users");
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchData,
  });

  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <ContentLayout title="Utilisateurs">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Utilisateurs</BreadcrumbPage>
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
                  <AddUserComponent />
                  <UserDataTable users={users ?? []} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

export default UserPage;
