import { ColumnDef } from "@/components/common/table/data-table";
import { Service } from "@/types/service/service";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface ServiceColumnsProps {
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getServiceColumns({
  onEdit,
  onDelete,
  canDelete,
  canEdit,
}: ServiceColumnsProps): ColumnDef<Service>[] {
  const columns: ColumnDef<Service>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (service) => <span className="font-medium">{service.name}</span>,
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (service) => <span className="font-medium">{service.slug}</span>,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (service) => (
        <span className="font-medium">{service.description}</span>
      ),
    },
    {
      header: "Active",
      cell: (service) => (
        <Badge
          className={
            service.isActive
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white "
          }
        >
          {service.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      header: "",
      cell: (user) => {
        const actions: TableAction<Service>[] = [
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
