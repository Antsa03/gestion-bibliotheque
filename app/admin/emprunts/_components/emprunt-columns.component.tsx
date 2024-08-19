"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
  Exemplaire as PrismaExemplaire,
  Emprunt as PrismaEmprunt,
  User,
  Livre,
} from "@prisma/client";
import { DataEmpruntRowActions } from "./emprunt-data-table-row-actions.component";
import { isEqual } from "date-fns";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

type Emprunt = PrismaEmprunt & {
  user: User;
  exemplaire: Exemplaire;
};

const resetHours = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const columns: ColumnDef<Emprunt>[] = [
  {
    accessorKey: "emprunt_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID emprunt" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("emprunt_id")}</div>
    ),
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Utilisateur" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("user_id")}</div>
    ),
  },
  {
    id: "nom_adherent",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom de l'adhérent" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("nom_adherent")}
      </div>
    ),
  },
  {
    id: "prenom_adherent",
    accessorFn: (row) => row.user.firstname,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom(s) de l'adhérent" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("prenom_adherent")}
      </div>
    ),
  },
  {
    accessorKey: "isbn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISBN" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("isbn")}</div>,
  },
  {
    id: "couverture",
    accessorFn: (row) => row.exemplaire.livre.couverture,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Couverture" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        <Image
          src={IMG_BASE_URL + row.original.exemplaire.livre.couverture}
          alt={`Couverture de ${row.original.exemplaire.livre.titre}`}
          width={90}
          height={90}
          className="w-24 h-24 object-cover rounded-sm"
        />
      </div>
    ),
  },
  {
    id: "titre",
    accessorFn: (row) => row.exemplaire.livre.titre,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre du livre" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("titre")}
      </div>
    ),
  },
  {
    accessorKey: "emprunt_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date d'emprunt" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {new Date(row.getValue("emprunt_date")).toLocaleDateString()}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const dateValue = new Date(row.getValue(columnId));
      const startDate = filterValue.startDate
        ? new Date(filterValue.startDate)
        : null;
      if (startDate) {
        return isEqual(resetHours(dateValue), resetHours(startDate));
      }
      return true;
    },
  },
  {
    accessorKey: "emprunt_retour_prevue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de retour prévue" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {new Date(row.getValue("emprunt_retour_prevue")).toLocaleDateString()}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const dateValue = new Date(row.getValue(columnId));
      const endDate = filterValue.endDate
        ? new Date(filterValue.endDate)
        : null;
      if (endDate) {
        return isEqual(resetHours(dateValue), resetHours(endDate));
      }
      return true;
    },
  },
  {
    accessorKey: "emprunt_retour",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de retour" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("emprunt_retour")
          ? new Date(row.getValue("emprunt_retour")).toLocaleDateString()
          : "N/A"}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const dateValue = new Date(row.getValue(columnId));
      const endDate = filterValue.endDate
        ? new Date(filterValue.endDate)
        : null;
      if (endDate) {
        return isEqual(resetHours(dateValue), resetHours(endDate));
      }
      return true;
    },
  },
  {
    accessorKey: "emprunt_statut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motif" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("emprunt_statut") ? "En cours" : "Terminé"}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataEmpruntRowActions row={row} />,
  },
];
