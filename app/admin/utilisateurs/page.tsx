"use client";
import React from "react";
import AddUserComponent from "./_components/add-user.component";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { User } from "@prisma/client";
import { useDelete } from "@/hooks/useDelete.hook";

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

  const queryClient = useQueryClient();

  //Logique de suppression
  const { handleDelete } = useDelete("/api/users/delete", () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  });
  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      <AddUserComponent />
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom(s)</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Role</th>
              <th>Email</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.firstname}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <button>Modifier</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(user.user_id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserPage;
