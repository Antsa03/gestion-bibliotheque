"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreate } from "@/hooks/useCreate.hook";
import { showToast } from "@/lib/showSwal";
import { Proprietaire } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AddModalProprietaire() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Proprietaire>({
    mode: "all",
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const create_proprietaire = useCreate<Proprietaire>(
    "/api/proprietaires/create",
    () => {
      showToast(
        "Information",
        "Le  proprietaire a été créé avec succès",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["proprietaires"] });
      setIsAddOpen(false);
    }
  );

  const handleSubmitProprietaire: SubmitHandler<Proprietaire> = async (
    data
  ) => {
    await create_proprietaire.handleAdd(data);
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <Button onClick={() => setIsAddOpen(true)} className="w-[300px]">
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouveau propriétaire
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout de nouveau propriétaire</DialogTitle>
          <DialogDescription>
            Formulaire pour ajouter de nouveau propriétaire
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitProprietaire)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="proprietaire_nom" className="text-center">
                Nom du propriétaire
              </Label>
              <Input
                {...register("proprietaire_nom", {
                  required: "Le nom du propriétaire est requis",
                })}
                className={`col-span-3 ${
                  errors.proprietaire_nom ? "border-red-600" : ""
                }`}
              />
              {errors.proprietaire_nom && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.proprietaire_nom.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-[90px]">
              Ok
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddOpen(false);
              }}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
