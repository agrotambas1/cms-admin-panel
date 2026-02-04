import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  getRowKey: (item: T, index: number) => string | number;
  enableRowSelection?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  onDeleteSelected?: (selectedIds: Set<string | number>) => void;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = "No data found",
  pagination,
  onPageChange,
  onLimitChange,
  getRowKey,
  enableRowSelection = false,
  selectedRows: externalSelectedRows,
  onSelectionChange,
  onDeleteSelected,
}: DataTableProps<T>) {
  const [internalSelectedRows, setInternalSelectedRows] = useState<
    Set<string | number>
  >(new Set());

  const selectedRows = externalSelectedRows ?? internalSelectedRows;
  const setSelectedRows = onSelectionChange ?? setInternalSelectedRows;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allRowKeys = new Set(
        data.map((item, index) => getRowKey(item, index)),
      );
      setSelectedRows(allRowKeys);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowKey: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowKey);
    } else {
      newSelected.delete(rowKey);
    }
    setSelectedRows(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedRows(new Set());
  };

  const handleDeleteSelected = () => {
    if (onDeleteSelected) {
      onDeleteSelected(selectedRows);
    }
  };

  const isAllSelected =
    data.length > 0 &&
    data.every((item, index) => selectedRows.has(getRowKey(item, index)));
  const isSomeSelected =
    data.some((item, index) => selectedRows.has(getRowKey(item, index))) &&
    !isAllSelected;

  if (loading) {
    return (
      <div className="overflow-hidden rounded-md border">
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="overflow-hidden rounded-md border">
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableRowSelection && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={
                      isSomeSelected ? "data-[state=checked]:bg-primary" : ""
                    }
                  />
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, rowIndex) => {
              const rowKey = getRowKey(item, rowIndex);
              const isSelected = selectedRows.has(rowKey);

              return (
                <TableRow
                  key={rowKey}
                  data-state={isSelected ? "selected" : undefined}
                  className={isSelected ? "bg-muted/50" : ""}
                >
                  {enableRowSelection && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(rowKey, checked as boolean)
                        }
                        aria-label={`Select row ${rowKey}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                          ? String(item[column.accessorKey] ?? "")
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && onLimitChange && (
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}

      {enableRowSelection && selectedRows.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-4 rounded-lg border bg-background px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedRows.size} row{selectedRows.size > 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>

              {onDeleteSelected && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="h-8"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
