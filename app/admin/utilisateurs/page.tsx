"use client";
import React from "react";
import AddUserComponent from "./_components/add-user.component";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { User } from "@prisma/client";
import { UserDataTable } from "./_components/user-data-table.component";

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

  // if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div className="relative h-full w-full min-h-screen">
      <div className="w-full flex justify-between mt-4 mb-4">
        <h1 className="text-2xl font-bold capitalize ">utilisateurs</h1>
        <AddUserComponent />
      </div>

      {isLoading ? (
        <div className="relative h-full w-full flex justify-center items-center">
          Chargement ...
        </div>
      ) : (
        <UserDataTable users={users ?? []} />
      )}
    </div>
  );
}

export default UserPage;
