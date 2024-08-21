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
import { CirclePlus, InfoIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays } from "date-fns";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ActionLoading from "@/components/action-loading.component";

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
    <>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter une nouvelle sanction
      </Button>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Ajout de nouvelle sanction"
        description="Formulaire pour ajouter une nouvelle sanction"
      >
        {create_sanction.isAdding ? (
          <ActionLoading text="En cours d'enregistrement ..." />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitSanction)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_id">Adhérent</Label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="user_id"
                    control={control}
                    rules={{ required: "Adhérent est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger
                          className={`border rounded-md p-1 shadow-sm ${
                            errors.user_id ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez l'adhérent" />
                          </span>
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
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
                </div>

                {errors.user_id && (
                  <p className="text-red-500 text-sm">
                    {errors.user_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sanction_deb">Date de début</Label>
                <div className="relative">
                  <Controller
                    name="sanction_deb"
                    control={control}
                    rules={{ required: "La date de début est requise" }}
                    render={({ field }) => (
                      <DatePicker
                        selectedDate={field.value}
                        onSelect={field.onChange}
                        placeholder="Sélectionner une date"
                        className={`w-full ${
                          errors.sanction_deb ? "border-red-600" : ""
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.sanction_deb && (
                  <p className="text-red-500 text-sm">
                    {errors.sanction_deb.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sanction_fin">Date de fin</Label>
                <div className="relative">
                  <Controller
                    name="sanction_fin"
                    control={control}
                    rules={{ required: "La date de fin est requise" }}
                    render={({ field }) => (
                      <DatePicker
                        selectedDate={field.value}
                        onSelect={field.onChange}
                        placeholder="Sélectionner une date"
                        className={`w-full ${
                          errors.sanction_fin ? "border-red-600" : ""
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.sanction_fin && (
                  <p className="text-red-500 text-sm">
                    {errors.sanction_fin.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sanction_motif">Motif</Label>
              <div className="relative">
                <InfoIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("sanction_motif", {
                    required: "Le motif est requis",
                  })}
                  className={`pl-10 ${
                    errors.sanction_motif ? "border-red-600" : ""
                  }`}
                />
              </div>

              {errors.sanction_motif && (
                <p className="text-red-500 text-sm">
                  {errors.sanction_motif.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button type="submit" className="min-w-[90px]">
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
        )}
      </ResponsiveDialog>
    </>
  );
}
