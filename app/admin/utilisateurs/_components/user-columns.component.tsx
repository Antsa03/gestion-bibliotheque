"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { User } from "@prisma/client";
import { DataUserRowActions } from "./user-data-table-row-actions.component";
import Image from "next/image";
import { IMG_PROFILE_URL } from "@/constants/img-profile-url.constant";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "profile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {" "}
        <Image
          src={IMG_PROFILE_URL + row.original.profile}
          alt={`Profile de ${row.original.name}`}
          width={90}
          height={90}
          className="object-cover rounded-full"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom(s)" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("firstname")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adresse" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Téléphone" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    cell: ({ row }) => (
      <div className="capitalize max-w-80 truncate">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="max-w-80 truncate">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataUserRowActions row={row} />,
  },
];
