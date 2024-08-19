"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import { Sanction } from "@prisma/client";
import UpdateModalSanction from "./update-modal-sanction.component";

export function DataSanctionRowActions({ row }: { row: Row<Sanction> }) {
  const queryClient = useQueryClient();
  const delete_sanction = useDelete("/api/sanctions/delete", () => {
    showToast(
      "Information",
      "La sanction a été supprimée avec succès",
      "success"
    );
  });

  const mutation = useMutation({
    mutationFn: (id: string | number) => delete_sanction.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanctions"] });
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const sanction = row.original;
  return (
    <div className="flex items-center">
      <UpdateModalSanction
        sanction={sanction}
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
          await mutation.mutateAsync(row.original.sanction_id)
        }
        variant="link"
        className="text-red-500"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
