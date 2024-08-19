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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { Sanction, User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { addDays, isEqual } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

type UpdateModalSanction = {
  sanction: Sanction;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalSanction({
  sanction,
  isEditOpen,
  setIsEditOpen,
}: UpdateModalSanction) {
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

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const update_sanction = useUpdate<Sanction>("/api/sanctions/update", () => {
    showToast(
      "Information",
      "La sanction a été modifiée avec succès",
      "success"
    );
    setIsEditOpen(false);
    queryClient.invalidateQueries({ queryKey: ["sanctions"] });
  });

  const handleSubmitSanction: SubmitHandler<Sanction> = async (data) => {
    let adjustedStartDate = data.sanction_deb;
    let adjustedEndDate = data.sanction_fin;

    // Comparer avec les dates d'origine et ajuster si nécessaire
    if (!isEqual(sanction.sanction_deb, data.sanction_deb)) {
      adjustedStartDate = addDays(data.sanction_deb, 1);
    }

    if (!isEqual(sanction.sanction_fin, data.sanction_fin)) {
      adjustedEndDate = addDays(data.sanction_fin, 1);
    }

    const updatedSanction: Sanction = {
      ...data,
      sanction_deb: adjustedStartDate,
      sanction_fin: adjustedEndDate,
      user_id: Number(data.user_id),
    };
    await update_sanction.handleUpdate(updatedSanction);
  };

  useEffect(() => {
    reset(sanction);
  }, [sanction, reset]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification de la sanction</DialogTitle>
          <DialogDescription>
            Formulaire pour modifier la sanction
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
                setIsEditOpen(false);
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
