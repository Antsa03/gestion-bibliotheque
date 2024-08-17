"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Proprietaire } from "@prisma/client";
import { DataProprietaireRowActions } from "./proprietaire-data-table-row-actions.component";

export const columns: ColumnDef<Proprietaire>[] = [
  {
    accessorKey: "proprietaire_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Propriétaire" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("proprietaire_id")}</div>
    ),
  },
  {
    accessorKey: "proprietaire_nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom du propriétaire" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("proprietaire_nom")}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataProprietaireRowActions row={row} />,
  },
];
