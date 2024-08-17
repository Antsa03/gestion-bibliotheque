"use client";
import React, { useMemo, useState } from "react";
import AddModalLivre from "./_components/add-modal-livres.component";
import { useFetchData } from "@/hooks/useFetchData.hook";
import { Livre as PrismaLivre, Auteur, Proprietaire } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";
import { useDelete } from "@/hooks/useDelete.hook";
import { showToast } from "@/lib/showSwal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import ShadCN UI card components
import { Button } from "@/components/ui/button"; // Import Button component if needed
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpdateModalLivre from "./_components/update-modal-livres.component";
import { saveAs } from "file-saver";
import { Input } from "@/components/ui/input";

type Livre = PrismaLivre & {
  auteur: Auteur;
  proprietaire: Proprietaire;
};

function LivresPage() {
  //Récupération des livres
  const livre_data = useFetchData<Livre[]>("/api/livres");
  const {
    data: livres,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["livres"],
    queryFn: livre_data.fetchData,
  });

  //Logique de suppression
  const queryClient = useQueryClient();
  const delete_livre = useDelete("/api/livres/delete", () => {
    queryClient.invalidateQueries({ queryKey: ["livres"] });
    showToast("Information", "Le livre a été supprimé avec succès", "success");
  });

  //L'état du modal edit
  const [isEditOpen, setIsEditOpen] = useState(false);

  //Logique de téléchargement du livre numérique
  const handleDownload = async (fileName: string | null) => {
    try {
      if (fileName) {
        const response = await fetch(`/api/download-file?fileName=${fileName}`);

        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du fichier");
        }

        const blob = await response.blob();
        saveAs(blob, fileName);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      showToast("Erreur", "Le téléchargement du fichier a échoué", "error");
    }
  };

  //Logique de filtrage de livre

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [domaineFilter, setDomaineFilter] = useState("");

  const filteredLivres = useMemo(() => {
    return livres?.filter((livre) => {
      const matchesSearch = livre.titre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "Tous" || livre.type_livre === typeFilter;
      const matchesDomaine =
        domaineFilter === "Tous" || livre.domaine === domaineFilter;
      return matchesSearch && matchesType && matchesDomaine;
    });
  }, [livres, searchTerm, typeFilter, domaineFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("Tous");
    setDomaineFilter("Tous");
  };

  if (isLoading) return <div>Chargement ...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div className="p-2">
      <h1>Livres</h1>
      <AddModalLivre />
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Rechercher par titre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-72 border rounded-md p-1 shadow-sm">
            <SelectValue placeholder="Sélectionnez un type de livre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="h-60">
              <SelectLabel>Type du livre</SelectLabel>
              <SelectItem value="Tous">Tous les types</SelectItem>
              <SelectItem value="Roman">Roman</SelectItem>
              <SelectItem value="Nouvelle">Nouvelle</SelectItem>
              <SelectItem value="Poésie">Poésie</SelectItem>
              <SelectItem value="Théatre">Théatre</SelectItem>
              <SelectItem value="Essai">Essai</SelectItem>
              <SelectItem value="Biographie">Biographie</SelectItem>
              <SelectItem value="Autobiographie">Autobiographie</SelectItem>
              <SelectItem value="Documentaire">Documentaire</SelectItem>
              <SelectItem value="Manga">Nouvelle</SelectItem>
              <SelectItem value="Jeunesse">Littérature jeunesse</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={domaineFilter} onValueChange={setDomaineFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par domaine" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup className="h-60">
              <SelectLabel>Domaine</SelectLabel>
              <SelectItem value="Tous">Tous les domaines</SelectItem>
              <SelectItem value="Narratif">Narratif</SelectItem>
              <SelectItem value="Théâtral">Théâtral</SelectItem>
              <SelectItem value="Poétique">Poétique</SelectItem>
              <SelectItem value="Scientifique">Scientifique</SelectItem>
              <SelectItem value="Philosophique">Philosophique</SelectItem>
              <SelectItem value="Religieux">Religieux</SelectItem>
              <SelectItem value="Historique">Historique</SelectItem>
              <SelectItem value="Voyage">Voyage</SelectItem>
              <SelectItem value="Horreur">Horreur</SelectItem>
              <SelectItem value="Science-fiction">Science-fiction</SelectItem>
              <SelectItem value="Fantastique">Fantastique</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={resetFilters} variant="outline">
          Réinitialiser les filtres
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLivres?.map((livre) => (
          <Card
            key={livre.livre_id}
            className="shadow-lg border border-gray-200"
          >
            <CardHeader>
              <Image
                src={IMG_BASE_URL + livre.couverture}
                alt={`Couverture de ${livre.titre}`}
                width={250}
                height={250}
                className="w-full h-64 object-cover rounded-sm"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{livre.titre}</CardTitle>
              <CardDescription className="flex flex-col">
                <span>{livre.description}</span>
                <span>Auteur: {livre.auteur.auteur_nom}</span>
                <span>Propriétaire: {livre.proprietaire.proprietaire_nom}</span>
                <span>Pages: {livre.nb_pages}</span>
                <span>Type: {livre.type_livre}</span>
                <span>Domaine: {livre.domaine}</span>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <UpdateModalLivre
                livre={livre}
                isEditOpen={isEditOpen}
                setIsEditOpen={setIsEditOpen}
              />
              {livre.livre_numerique && (
                <Button
                  className="bg-green-500 hover:bg-green-700 text-white"
                  onClick={() => handleDownload(livre.livre_numerique)}
                >
                  Télécharger
                </Button>
              )}
              <Button
                className="bg-yellow-500 hover:bg-yellow-700 text-white"
                onClick={() => setIsEditOpen(true)}
              >
                Modifier
              </Button>
              <Button
                type="button"
                onClick={() => delete_livre.handleDelete(livre.livre_id)}
                className="bg-red-500 hover:bg-red-700 text-white"
              >
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LivresPage;
