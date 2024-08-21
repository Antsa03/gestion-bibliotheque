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
import InputError from "@/components/ui/input-error";
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
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouveau propriétaire
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout de nouveau propriétaire</DialogTitle>
          {/* <DialogDescription>
            Formulaire pour ajouter de nouveau propriétaire
          </DialogDescription> */}
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
                <InputError
                  message={errors.proprietaire_nom?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="no-bg-destructive"
              onClick={() => {
                setIsAddOpen(false);
              }}
              className="hover:bg-red-100 rounded-full"
            >
              Annuler
            </Button>

            <Button type="submit" className="w-[90px]">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
