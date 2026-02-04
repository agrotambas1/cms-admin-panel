import { ColumnDef } from "@/components/common/table/data-table";
import { Tag } from "../../../../../types/article/tag";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";

interface TagColumnsProps {
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export function getTagColumns({
  onEdit,
  onDelete,
}: TagColumnsProps): ColumnDef<Tag>[] {
  return [
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
    {
      header: "",
      cell: (user) => {
        const actions: TableAction<Tag>[] = [
          {
            label: "Edit",
            onClick: onEdit,
          },
          {
            label: "Delete",
            onClick: onDelete,
            variant: "destructive",
            separator: true,
          },
        ];

        return <TableActionsMenu item={user} actions={actions} />;
      },
      className: "w-[50px]",
    },
  ];
}
