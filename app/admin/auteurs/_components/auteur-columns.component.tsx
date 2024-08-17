"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Auteur } from "@prisma/client";
import { DataAuteurRowActions } from "./auteur-data-table-row-actions.component";

export const columns: ColumnDef<Auteur>[] = [
  {
    accessorKey: "auteur_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Auteur" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("auteur_id")}</div>
    ),
  },
  {
    accessorKey: "auteur_nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom de l'auteur" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("auteur_nom")}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataAuteurRowActions row={row} />,
  },
];
