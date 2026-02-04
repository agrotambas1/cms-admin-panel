import { ColumnDef } from "@/components/common/table/data-table";
import { Category } from "../../../../../types/article/category";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";

interface CategoryColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function getCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnsProps): ColumnDef<Category>[] {
  return [
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
    {
      header: "",
      cell: (user) => {
        const actions: TableAction<Category>[] = [
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
