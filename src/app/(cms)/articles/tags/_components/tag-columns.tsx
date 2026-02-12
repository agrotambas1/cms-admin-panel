import { ColumnDef } from "@/components/common/table/data-table";
import { Tag } from "../../../../../types/article/tag";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface TagColumnsProps {
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getTagColumns({
  onEdit,
  onDelete,
  canDelete,
  canEdit,
}: TagColumnsProps): ColumnDef<Tag>[] {
  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
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
        const actions: TableAction<Tag>[] = [
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
