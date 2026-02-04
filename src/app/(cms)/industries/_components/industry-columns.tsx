import { ColumnDef } from "@/components/common/table/data-table";
import { Industry } from "@/types/industry/industry";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";

interface IndustryColumnsProps {
  onEdit: (industry: Industry) => void;
  onDelete: (industry: Industry) => void;
}

export function getIndustryColumns({
  onEdit,
  onDelete,
}: IndustryColumnsProps): ColumnDef<Industry>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (industry) => <span className="font-medium">{industry.name}</span>,
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (industry) => <span className="font-medium">{industry.slug}</span>,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (industry) => (
        <span className="font-medium">{industry.description}</span>
      ),
    },
    {
      header: "Active",
      cell: (industry) => (
        <Badge
          className={
            industry.isActive
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white "
          }
        >
          {industry.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "",
      cell: (user) => {
        const actions: TableAction<Industry>[] = [
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
