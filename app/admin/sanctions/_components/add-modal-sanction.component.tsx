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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreate } from "@/hooks/useCreate.hook";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { showToast } from "@/lib/showSwal";
import { Sanction, User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays } from "date-fns";

export default function AddModalSanction() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Sanction>({
    mode: "all",
  });

  //Récupérer les utilisateurs
  const { fetchData } = useFetchData<User[]>("/api/users");
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchData,
  });

  const queryClient = useQueryClient();
  const create_sanction = useCreate<Sanction>("/api/sanctions/create", () => {
    showToast("Information", "La sanction a été créée avec succès", "success");
    queryClient.invalidateQueries({ queryKey: ["sanctions"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    setIsAddOpen(false);
  });

  const handleSubmitSanction: SubmitHandler<Sanction> = async (data) => {
    // Ajuster la date pour éviter le problème de décalage
    const adjustedStartDate = addDays(data.sanction_deb, 1);
    const adjustedEndDate = addDays(data.sanction_fin, 1);

    const transformedData: Sanction = {
      ...data,
      sanction_deb: adjustedStartDate, // Remplacer par la date ajustée
      sanction_fin: adjustedEndDate, // Remplacer par la date ajustée
      user_id: Number(data.user_id),
    };
    await create_sanction.handleAdd(transformedData);
  };

  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <Button onClick={() => setIsAddOpen(true)} className="w-[300px]">
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter une nouvelle sanction
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout de nouvelle sanction</DialogTitle>
          <DialogDescription>
            Formulaire pour ajouter une nouvelle sanction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitSanction)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="user_id" className="text-center">
                Adhérent
              </Label>
              <Controller
                name="user_id"
                control={control}
                rules={{ required: "Adhérent est requis" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="col-span-3 border rounded-md p-1 shadow-sm">
                      <SelectValue placeholder="Sélectionnez l'adhérent" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.user_id ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup>
                        <SelectLabel>Liste des adhérents</SelectLabel>
                        {users
                          ?.filter((user) => user.role === "Adhérent")
                          .map((user) => (
                            <SelectItem
                              key={user.user_id}
                              value={user.user_id.toString()}
                            >
                              {user.email +
                                ": " +
                                user.name +
                                " " +
                                user.firstname}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.user_id && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.user_id.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="sanction_deb" className="text-center">
                Date de début
              </Label>
              <Controller
                name="sanction_deb"
                control={control}
                rules={{ required: "La date de début est requise" }}
                render={({ field }) => (
                  <DatePicker
                    selectedDate={field.value}
                    onSelect={field.onChange}
                    placeholder="Sélectionner une date"
                    className={`col-span-3 ${
                      errors.sanction_deb ? "border-red-600" : ""
                    }`}
                  />
                )}
              />
              {errors.sanction_deb && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.sanction_deb.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="sanction_fin" className="text-center">
                Date de fin
              </Label>
              <Controller
                name="sanction_fin"
                control={control}
                rules={{ required: "La date de fin est requise" }}
                render={({ field }) => (
                  <DatePicker
                    selectedDate={field.value}
                    onSelect={field.onChange}
                    placeholder="Sélectionner une date"
                    className={`col-span-3 ${
                      errors.sanction_fin ? "border-red-600" : ""
                    }`}
                  />
                )}
              />
              {errors.sanction_fin && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.sanction_fin.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="sanction_motif" className="text-center">
                Motif
              </Label>
              <Input
                {...register("sanction_motif", {
                  required: "Le motif est requis",
                })}
                className={`col-span-3 ${
                  errors.sanction_motif ? "border-red-600" : ""
                }`}
              />
              {errors.sanction_motif && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.sanction_motif.message}
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
