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
import { Auteur } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AddModalAuteur() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Auteur>({
    mode: "all",
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const create_auteur = useCreate<Auteur>("/api/auteurs/create", () => {
    showToast("Information", "L'auteur a été créé avec succès", "success");
    queryClient.invalidateQueries({ queryKey: ["auteurs"] });
    setIsAddOpen(false);
  });

  const handleSubmitAuteur: SubmitHandler<Auteur> = async (data) => {
    await create_auteur.handleAdd(data);
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouvel auteur
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout de nouvel auteur</DialogTitle>
          {/* <DialogDescription>
            Formulaire pour ajouter de nouvel auteur
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitAuteur)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="auteur_nom" className="text-center">
                Nom de l'auteur
              </Label>
              <Input
                {...register("auteur_nom", {
                  required: "La désignation est requise",
                })}
                className={`col-span-3 ${
                  errors.auteur_nom ? "border-red-600" : ""
                }`}
              />
              {errors.auteur_nom && (
                <InputError
                  message={errors.auteur_nom?.message}
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

            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
