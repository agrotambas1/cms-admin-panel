import { ColumnDef } from "@/components/common/table/data-table";
import { Category } from "../../../../../types/article/category";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getCategoryColumns({
  onEdit,
  onDelete,
  canDelete,
  canEdit,
}: CategoryColumnsProps): ColumnDef<Category>[] {
  const columns: ColumnDef<Category>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (category) => <span className="font-medium">{category.name}</span>,
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (category) => <span className="font-medium">{category.slug}</span>,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (category) => (
        <span className="font-medium">{category.description}</span>
      ),
    },
    {
      header: "Active",
      cell: (category) => (
        <Badge
          className={
            category.isActive
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white "
          }
        >
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      header: "",
      cell: (user) => {
        const actions: TableAction<Category>[] = [
          ...(canEdit
            ? [
                {
                  label: "Edit",
                  onClick: onEdit,
                  icon: <Pencil className="h-4 w-4" />,
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: "Delete",
                  onClick: onDelete,
                  variant: "destructive" as const,
                  icon: <Trash2 className="h-4 w-4 bg text-red-600" />,
                  separator: true,
                },
              ]
            : []),
        ];

        return <TableActionsMenu item={user} actions={actions} />;
      },
      className: "w-[50px]",
    });
  }

  return columns;
}
