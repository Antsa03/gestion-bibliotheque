"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import { User } from "@prisma/client";
import UpdateModalUser from "./update-user.component";

export function DataUserRowActions({ row }: { row: Row<User> }) {
  const queryClient = useQueryClient();
  const delete_user = useDelete("/api/users/delete", () => {
    showToast(
      "Information",
      "L'utilisateur a été supprimé avec succès",
      "success"
    );
  });

  const mutation = useMutation({
    mutationFn: (id: string | number) => delete_user.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livres"] });
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const user = row.original;
  return (
    <div className="flex items-center">
      <UpdateModalUser
        user={user}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
      />
      <Button
        className="text-yellow-500"
        variant="link"
        onClick={() => setIsEditOpen(true)}
      >
        <Pencil className="h-6 w-6" />
      </Button>
      <Button
        onClick={async () => await mutation.mutateAsync(row.original.user_id)}
        variant="link"
        className="text-red-500"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
