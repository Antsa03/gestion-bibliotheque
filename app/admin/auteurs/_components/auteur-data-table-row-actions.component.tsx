"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import { Auteur } from "@prisma/client";
import UpdateModalAuteur from "./update-modal-auteur.component";

export function DataAuteurRowActions({ row }: { row: Row<Auteur> }) {
  const queryClient = useQueryClient();
  const delete_auteur = useDelete("/api/auteurs/delete", () => {
    showToast("Information", "L'auteur a été supprimé avec succès", "success");
  });

  const mutation = useMutation({
    mutationFn: (id: string | number) => delete_auteur.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livres"] });
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const auteur = row.original;
  return (
    <div className="flex items-center">
      <UpdateModalAuteur
        auteur={auteur}
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
        onClick={async () => await mutation.mutateAsync(row.original.auteur_id)}
        variant="link"
        className="text-red-500"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
