"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Exemplaire as PrismaExemplaire, Livre } from "@prisma/client";
import { DataExemplaireRowActions } from "./exemplaire-data-table-row-actions.component";
import Image from "next/image";
import { IMG_BASE_URL } from "@/constants/img-base-url.constant";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

export const columns: ColumnDef<Exemplaire>[] = [
  {
    accessorKey: "isbn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISBN" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("isbn")}</div>,
  },
  {
    accessorKey: "livre_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Livre" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("livre_id")}</div>
    ),
  },
  {
    id: "couverture",
    accessorFn: (row) => row.livre.couverture,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Couverture" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        <Image
          src={IMG_BASE_URL + row.original.livre.couverture}
          alt={`Couverture de ${row.original.livre.titre}`}
          width={90}
          height={90}
          className="w-24 h-24 object-cover rounded-sm"
        />
      </div>
    ),
  },
  {
    id: "titre",
    accessorFn: (row) => row.livre.titre,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("titre")}
      </div>
    ),
  },
  {
    accessorKey: "cote",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cote" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">{row.getValue("cote")}</div>
    ),
  },
  {
    accessorKey: "disponible",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disponible" />
    ),
    cell: ({ row }) => <div>{row.original.disponible ? "Oui" : "Non"}</div>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataExemplaireRowActions row={row} />,
  },
];
