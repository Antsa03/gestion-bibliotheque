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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreate } from "@/hooks/useCreate.hook";
import { showToast } from "@/lib/showSwal";
import { Auteur, Livre, Proprietaire } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookUp2,
  Captions,
  CirclePlus,
  Layers3,
  SquareKanban,
  SquareUser,
  UserRoundPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ActionLoading from "@/components/action-loading.component";

export default function AddModalLivre() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Livre>({
    mode: "all",
  });

  //Récupérer l'auteur et le propriétaire
  const proprietaire_data = useFetchData<Proprietaire[]>("/api/proprietaires");
  const { data: proprietaires } = useQuery({
    queryKey: ["proprietaires"],
    queryFn: proprietaire_data.fetchData,
  });

  const auteur_data = useFetchData<Auteur[]>("/api/auteurs");
  const { data: auteurs } = useQuery({
    queryKey: ["auteurs"],
    queryFn: auteur_data.fetchData,
  });

  //Instance de query client (React query)
  const queryClient = useQueryClient();
  const create_livre = useCreate<Livre>("/api/livres/create", () => {
    showToast("Information", "Le livre a été créé avec succès", "success");
    queryClient.invalidateQueries({ queryKey: ["livres"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    setIsAddOpen(false);
  });

  const handleSubmitLivre: SubmitHandler<Livre> = async (data) => {
    const formData = new FormData();

    if (
      data.couverture &&
      (data.couverture as unknown as FileList).length > 0
    ) {
      formData.append(
        "couverture",
        (data.couverture as unknown as FileList)[0]
      );
    }

    if (
      data.livre_numerique &&
      (data.livre_numerique as unknown as FileList).length > 0
    ) {
      formData.append(
        "livre_numerique",
        (data.livre_numerique as unknown as FileList)[0]
      );
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      // Utiliser result.couvertureFileName et result.livreNumeriqueFileName pour mettre à jour la base de données
      const transformedData: Livre = {
        ...data,
        nb_pages: Number(data.nb_pages),
        auteur_id: Number(data.auteur_id),
        proprietaire_id: Number(data.proprietaire_id),
        couverture: result.couvertureFileName || "", // Assure que c'est une string
        livre_numerique: result.livreNumeriqueFileName || "", // Assure que c'est une string
      };

      await create_livre.handleAdd(transformedData);
    } else {
      console.error("Erreur lors de l'upload", result);
    }
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouveau livre
      </Button>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Ajout de nouveau livre"
        description="Formulaire pour ajouter de nouveau livre"
      >
        {create_livre.isAdding ? (
          <ActionLoading text="En cours d'enregistrement ..." />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitLivre)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <div className="relative">
                  <Captions
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("titre", {
                      required: "Le titre est requis",
                    })}
                    className={`pl-10 ${errors.titre ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.titre && (
                  <p className="text-red-500 text-sm">{errors.titre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nb_pages">Nombre de page</Label>
                <div className="relative">
                  <Layers3
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("nb_pages", {
                      required: "Le nombre de page est requis",
                    })}
                    className={`pl-10 ${errors.titre ? "border-red-600" : ""}`}
                    type="number"
                  />
                </div>
                {errors.nb_pages && (
                  <p className="text-red-500 text-sm">
                    {errors.nb_pages.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="titre">Description</Label>
                <Textarea
                  {...register("description", {
                    required: "La désignation est requise",
                  })}
                  className={`${errors.description ? "border-red-600" : ""}`}
                  placeholder="Petite description du livre"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type_livre">Type du livre</Label>
                <div className="relative">
                  <Layers3
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="type_livre"
                    control={control}
                    rules={{ required: "Le type de livre est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={`pl-10 border rounded-md p-1 shadow-sm ${
                            errors.type_livre ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez un type de livre" />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-56">
                            <SelectLabel>Type du livre</SelectLabel>
                            <SelectItem value="Roman">Roman</SelectItem>
                            <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                            <SelectItem value="Poésie">Poésie</SelectItem>
                            <SelectItem value="Théatre">Théatre</SelectItem>
                            <SelectItem value="Essai">Essai</SelectItem>
                            <SelectItem value="Biographie">
                              Biographie
                            </SelectItem>
                            <SelectItem value="Autobiographie">
                              Autobiographie
                            </SelectItem>
                            <SelectItem value="Documentaire">
                              Documentaire
                            </SelectItem>
                            <SelectItem value="Manga">Nouvelle</SelectItem>
                            <SelectItem value="Jeunesse">
                              Littérature jeunesse
                            </SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.type_livre && (
                  <p className="text-red-500 text-sm">
                    {errors.type_livre.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="domaine">Domaine</Label>
                <div className="relative">
                  <Layers3
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="domaine"
                    control={control}
                    rules={{ required: "Le domaine est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={`pl-10 border rounded-md p-1 shadow-sm ${
                            errors.domaine ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez un domaine" />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-56">
                            <SelectLabel>Domaine</SelectLabel>
                            <SelectItem value="Narratif">Narratif</SelectItem>
                            <SelectItem value="Théâtral">Théâtral</SelectItem>
                            <SelectItem value="Poétique">Poétique</SelectItem>
                            <SelectItem value="Scientifique">
                              Scientifique
                            </SelectItem>
                            <SelectItem value="Philosophique">
                              Philosophique
                            </SelectItem>
                            <SelectItem value="Religieux">Religieux</SelectItem>
                            <SelectItem value="Historique">
                              Historique
                            </SelectItem>
                            <SelectItem value="Voyage">Voyage</SelectItem>
                            <SelectItem value="Horreur">Horreur</SelectItem>
                            <SelectItem value="Science-fiction">
                              Science-fiction
                            </SelectItem>
                            <SelectItem value="Fantastique">
                              Fantastique
                            </SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.domaine && (
                  <p className="text-red-500 text-sm">
                    {errors.domaine.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="couverture">Couverture</Label>
                <div className="relative">
                  <SquareKanban
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("couverture", {
                      required: "La couverture est requise",
                    })}
                    className={`pl-10 ${
                      errors.couverture ? "border-red-600" : ""
                    }`}
                    type="file"
                  />
                </div>
                {errors.couverture && (
                  <p className="text-red-500 text-sm">
                    {errors.couverture.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="livre_numerique">Livre numérique</Label>
                <div className="relative">
                  <BookUp2
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("livre_numerique")}
                    type="file"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auteur_id">Auteur</Label>
                <div className="relative">
                  <UserRoundPen
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="auteur_id"
                    control={control}
                    rules={{ required: "L'auteur est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger
                          className={`pl-10 border rounded-md p-1 shadow-sm ${
                            errors.auteur_id ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez l'auteur" />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>L'auteur</SelectLabel>
                            {auteurs?.map((auteur) => (
                              <SelectItem
                                key={auteur.auteur_id}
                                value={auteur.auteur_id.toString()}
                              >
                                {auteur.auteur_nom}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.auteur_id && (
                  <p className="text-red-500 text-sm">
                    {errors.auteur_id.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="proprietaire_id">Propriétaire</Label>
                <div className="relative">
                  <SquareUser
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="proprietaire_id"
                    control={control}
                    rules={{ required: "Le propriétaire est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger
                          className={`pl-10 border rounded-md p-1 shadow-sm ${
                            errors.proprietaire_id ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez le proprietaire" />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>L'auteur</SelectLabel>
                            {proprietaires?.map((proprietaire) => (
                              <SelectItem
                                key={proprietaire.proprietaire_id}
                                value={proprietaire.proprietaire_id.toString()}
                              >
                                {proprietaire.proprietaire_nom}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.proprietaire_id && (
                  <p className="text-red-500 text-sm">
                    {errors.proprietaire_id.message}
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
        )}
      </ResponsiveDialog>
    </>
  );
}
