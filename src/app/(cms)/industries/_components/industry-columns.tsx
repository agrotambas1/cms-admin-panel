import { ColumnDef } from "@/components/common/table/data-table";
import { Industry } from "@/types/industry/industry";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface IndustryColumnsProps {
  onEdit: (industry: Industry) => void;
  onDelete: (industry: Industry) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getIndustryColumns({
  onEdit,
  onDelete,
  canDelete,
  canEdit,
}: IndustryColumnsProps): ColumnDef<Industry>[] {
  const columns: ColumnDef<Industry>[] = [
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
  ];

  if (canEdit || canDelete) {
    columns.push({
      header: "",
      cell: (user) => {
        const actions: TableAction<Industry>[] = [
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
