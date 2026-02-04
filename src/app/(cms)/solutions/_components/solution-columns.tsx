import { ColumnDef } from "@/components/common/table/data-table";
import { Solution } from "@/types/solution/solution";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";

interface SolutionColumnsProps {
  onEdit: (solution: Solution) => void;
  onDelete: (solution: Solution) => void;
}

export function getSolutionColumns({
  onEdit,
  onDelete,
}: SolutionColumnsProps): ColumnDef<Solution>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (solution) => <span className="font-medium">{solution.name}</span>,
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (solution) => <span className="font-medium">{solution.slug}</span>,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (solution) => (
        <span className="font-medium">{solution.description}</span>
      ),
    },
    {
      header: "Active",
      cell: (solution) => (
        <Badge
          className={
            solution.isActive
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white "
          }
        >
          {solution.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "",
      cell: (user) => {
        const actions: TableAction<Solution>[] = [
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
