"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, FilterIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Livre,
  Emprunt as PrismaEmprunt,
  Exemplaire as PrismaExemplaire,
  User,
} from "@prisma/client";
import { columns } from "./emprunt-columns.component";

type Exemplaire = PrismaExemplaire & {
  livre: Livre;
};

type Emprunt = PrismaEmprunt & {
  user: User;
  exemplaire: Exemplaire;
};

type EmpruntDataTableProps = {
  emprunts: Emprunt[];
};

export function EmpruntDataTable({ emprunts }: EmpruntDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const table = useReactTable({
    data: emprunts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    table.getColumn("emprunt_date")?.setFilterValue({ startDate: start });
    table.getColumn("emprunt_retour_prevue")?.setFilterValue({ endDate: end });
  };

  const resetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    table.getColumn("emprunt_date")?.setFilterValue(undefined);
    table.getColumn("emprunt_retour_prevue")?.setFilterValue(undefined);
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Recherche par nom ..."
          value={
            (table.getColumn("nom_adherent")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nom_adherent")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <DatePicker
            selectedDate={startDate}
            onSelect={(date) => handleDateChange(date, endDate)}
            placeholder="Date d'emprunt"
            className="w-full sm:w-[240px]"
          />
          <DatePicker
            selectedDate={endDate}
            onSelect={(date) => handleDateChange(startDate, date)}
            placeholder="Date de retour prévue"
            className="w-full sm:w-[240px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button
            onClick={resetDates}
            variant="outline"
            className="flex items-center justify-start gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            <span>Réinitialiser</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
              >
                <span>Colonnes</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Auncun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
