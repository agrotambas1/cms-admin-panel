import { ColumnDef } from "@/components/common/table/data-table";
import { Capability } from "@/types/capability/capability";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";

interface CapabilityColumnsProps {
  onEdit: (capability: Capability) => void;
  onDelete: (capability: Capability) => void;
}

export function getCapabilityColumns({
  onEdit,
  onDelete,
}: CapabilityColumnsProps): ColumnDef<Capability>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (capability) => (
        <span className="font-medium">{capability.name}</span>
      ),
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: (capability) => (
        <span className="font-medium">{capability.slug}</span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (capability) => (
        <span className="font-medium">{capability.description}</span>
      ),
    },
    {
      header: "Active",
      cell: (capability) => (
        <Badge
          className={
            capability.isActive
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white "
          }
        >
          {capability.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "",
      cell: (user) => {
        const actions: TableAction<Capability>[] = [
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
