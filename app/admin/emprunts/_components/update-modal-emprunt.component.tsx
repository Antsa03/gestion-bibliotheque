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
import { CirclePlus, Library, User as UserIcon } from "lucide-react";
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
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ActionLoading from "@/components/action-loading.component";

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
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Modification de l'emprunt"
        description="Formulaire pour modifier un emprunt"
      >
        {update_emprunt.isUpdating ? (
          <ActionLoading text="En cours de modification ..." />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitEmprunt)}
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
                          className={`pl-10 border rounded-md p-1 shadow-sm ${
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
                <Label htmlFor="isbn">Exemplaire</Label>
                <div className="relative">
                  <Library
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="isbn"
                    control={control}
                    rules={{ required: "L'ISBN de l'exemplaire est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger
                          className={`pl-10 border rounded-md p-1 shadow-sm h-32 ${
                            errors.isbn ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez l'exemplaire" />
                          </span>
                        </SelectTrigger>
                        <SelectContent
                          className={`pl-10 ${
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
                                    src={
                                      IMG_BASE_URL + exemplaire.livre.couverture
                                    }
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
                </div>

                {errors.isbn && (
                  <p className="text-red-500 text-sm">{errors.isbn.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emprunt_date">Date d'emprunt</Label>
                <div className="relative">
                  <Controller
                    name="emprunt_date"
                    control={control}
                    rules={{ required: "La date d'emprunt est requise" }}
                    render={({ field }) => (
                      <DatePicker
                        selectedDate={field.value}
                        onSelect={field.onChange}
                        placeholder="Sélectionner une date"
                        className={`w-full ${
                          errors.emprunt_date ? "border-red-600" : ""
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.emprunt_date && (
                  <p className="text-red-500 text-sm">
                    {errors.emprunt_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emprunt_retour_prevue">
                  Date de retour prévue
                </Label>
                <div className="relative">
                  <Controller
                    name="emprunt_retour_prevue"
                    control={control}
                    rules={{ required: "La date de retour prévue est requise" }}
                    render={({ field }) => (
                      <DatePicker
                        selectedDate={field.value}
                        onSelect={field.onChange}
                        placeholder="Sélectionner une date"
                        className={`w-full ${
                          errors.emprunt_retour_prevue ? "border-red-600" : ""
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.emprunt_retour_prevue && (
                  <p className="text-red-500 text-sm">
                    {errors.emprunt_retour_prevue.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="submit" className="min-w-[90px]">
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
        )}
      </ResponsiveDialog>
    </>
  );
}
