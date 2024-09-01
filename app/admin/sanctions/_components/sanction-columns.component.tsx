"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Sanction as PrismaSanction, User } from "@prisma/client";
import { DataSanctionRowActions } from "./sanction-data-table-row-actions.component";
import { isEqual } from "date-fns";

type Sanction = PrismaSanction & {
  user: User;
};

const resetHours = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const columns: ColumnDef<Sanction>[] = [
  {
    accessorKey: "sanction_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Sanction" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("sanction_id")}</div>
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
    accessorKey: "sanction_deb",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de début" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {new Date(row.getValue("sanction_deb")).toLocaleDateString()}
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
    accessorKey: "sanction_fin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de fin" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {new Date(row.getValue("sanction_fin")).toLocaleDateString()}
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
    accessorKey: "sanction_motif",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motif de la sanction" />
    ),
    cell: ({ row }) => <div>{row.getValue("sanction_motif")}</div>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataSanctionRowActions row={row} />,
  },
];
