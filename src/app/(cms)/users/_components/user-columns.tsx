import { ColumnDef } from "@/components/common/table/data-table";
import { User } from "../../../../types/users/user";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";

interface UserColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getUserColumns({
  onEdit,
  onDelete,
}: UserColumnsProps): ColumnDef<User>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: (user) => <span className="font-medium">{user.name}</span>,
    },
    {
      header: "Username",
      accessorKey: "username",
      cell: (user) => <span className="font-medium">{user.username}</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (user) => <span className="font-medium">{user.email}</span>,
    },
    {
      header: "Role",
      cell: (user) => (
        <span className="capitalize">{formatRole(user.role)}</span>
      ),
    },
    {
      header: "Active",
      cell: (user) => (
        <Badge
          className={
            user.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white "
          }
        >
          {user.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Created At",
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
      className: "text-right",
    },
    {
      header: "",
      cell: (user) => {
        const actions: TableAction<User>[] = [
          {
            label: "Edit",
            onClick: onEdit,
          },
        ];

        if (user.role !== "ADMIN") {
          actions.push({
            label: "Delete",
            onClick: onDelete,
            variant: "destructive",
            separator: true,
          });
        }

        return <TableActionsMenu item={user} actions={actions} />;
      },
      className: "w-[50px]",
    },
  ];
}
