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
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import {
  Exemplaire as PrismaExemplaire,
  Emprunt,
  User,
  Livre,
} from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays, isEqual } from "date-fns";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

type UpdateModalEmpruntProps = {
  emprunt: Emprunt;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalEmprunt({
  emprunt,
  isEditOpen,
  setIsEditOpen,
}: UpdateModalEmpruntProps) {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Emprunt>({
    mode: "all",
  });

  // Récupérer les exemplaires et les utilisateurs
  const { fetchData: fetchExemplaires } =
    useFetchData<Exemplaire[]>("/api/exemplaires");
  const { fetchData: fetchUsers } = useFetchData<User[]>("/api/users");
  const { data: exemplaires } = useQuery({
    queryKey: ["exemplaires"],
    queryFn: fetchExemplaires,
  });
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const queryClient = useQueryClient();
  const update_emprunt = useUpdate<Emprunt>("/api/emprunts/update", () => {
    showToast("Information", "L'emprunt a été modifié avec succès", "success");
    setIsEditOpen(false);
    queryClient.invalidateQueries({ queryKey: ["emprunts"] });
  });

  const handleSubmitEmprunt: SubmitHandler<Emprunt> = async (data) => {
    let adjustedStartDate = data.emprunt_date;
    let adjustedEndDate = data.emprunt_retour_prevue;

    // Comparer avec les dates d'origine et ajuster si nécessaire
    if (!isEqual(emprunt.emprunt_date, data.emprunt_date)) {
      adjustedStartDate = addDays(data.emprunt_date, 1);
    }

    if (!isEqual(emprunt.emprunt_retour_prevue, data.emprunt_retour_prevue)) {
      adjustedEndDate = addDays(data.emprunt_retour_prevue, 1);
    }

    const transformedData: Emprunt = {
      ...data,
      emprunt_date: adjustedStartDate, // Remplacer par la date ajustée
      emprunt_retour_prevue: adjustedEndDate, // Remplacer par la date ajustée
      user_id: Number(data.user_id),
    };
    await update_emprunt.handleUpdate(transformedData);
  };

  useEffect(() => {
    reset(emprunt);
  }, [emprunt, reset]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification de l'emprunt</DialogTitle>
          <DialogDescription>
            Formulaire pour modifier un emprunt existant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitEmprunt)}>
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
              <Label htmlFor="isbn" className="text-center">
                Exemplaire
              </Label>
              <Controller
                name="isbn"
                control={control}
                rules={{ required: "L'ISBN de l'exemplaire est requis" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="col-span-3 border rounded-md p-1 shadow-sm h-32">
                      <SelectValue placeholder="Sélectionnez l'exemplaire" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.isbn ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup>
                        <SelectLabel>Liste des exemplaires</SelectLabel>
                        {exemplaires?.map((exemplaire) => (
                          <SelectItem
                            key={exemplaire.isbn}
                            value={exemplaire.isbn}
                          >
                            <div className="flex items-center w-full">
                              <Image
                                src={IMG_BASE_URL + exemplaire.livre.couverture}
                                alt={`Couverture de ${exemplaire.livre.titre}`}
                                width={90}
                                height={90}
                                className="w-24 h-24 object-cover rounded-sm"
                              />
                              <div className="ml-4 flex flex-1 flex-col gap-4">
                                <span>{exemplaire.livre.titre}</span>
                                <span>{"ISBN: " + exemplaire.isbn}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.isbn && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.isbn.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="emprunt_date" className="text-center">
                Date d'emprunt
              </Label>
              <Controller
                name="emprunt_date"
                control={control}
                rules={{ required: "La date d'emprunt est requise" }}
                render={({ field }) => (
                  <DatePicker
                    selectedDate={field.value}
                    onSelect={field.onChange}
                    placeholder="Sélectionner une date"
                    className={`col-span-3 ${
                      errors.emprunt_date ? "border-red-600" : ""
                    }`}
                  />
                )}
              />
              {errors.emprunt_date && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.emprunt_date.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="emprunt_retour_prevue" className="text-center">
                Date de retour prévue
              </Label>
              <Controller
                name="emprunt_retour_prevue"
                control={control}
                rules={{ required: "La date de retour prévue est requise" }}
                render={({ field }) => (
                  <DatePicker
                    selectedDate={field.value}
                    onSelect={field.onChange}
                    placeholder="Sélectionner une date"
                    className={`col-span-3 ${
                      errors.emprunt_retour_prevue ? "border-red-600" : ""
                    }`}
                  />
                )}
              />
              {errors.emprunt_retour_prevue && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.emprunt_retour_prevue.message}
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
              onClick={() => setIsEditOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
