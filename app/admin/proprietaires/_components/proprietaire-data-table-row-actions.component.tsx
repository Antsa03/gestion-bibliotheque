"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import { Proprietaire } from "@prisma/client";
import UpdateModalProprietaire from "./update-modal-proprietaire.component";

export function DataProprietaireRowActions({
  row,
}: {
  row: Row<Proprietaire>;
}) {
  const queryClient = useQueryClient();
  const delete_proprietaire = useDelete("/api/proprietaires/delete", () => {
    showToast(
      "Information",
      "Le propriétaire a été supprimé avec succès",
      "success"
    );
  });

  const mutation = useMutation({
    mutationFn: (id: string | number) => delete_proprietaire.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proprietaires"] });
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const proprietaire = row.original;
  return (
    <div className="flex items-center">
      <UpdateModalProprietaire
        proprietaire={proprietaire}
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
        onClick={async () =>
          await mutation.mutateAsync(row.original.proprietaire_id)
        }
        variant="link"
        className="text-red-500"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
