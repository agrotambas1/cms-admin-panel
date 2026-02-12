"use client";

import { DataTable } from "@/components/common/table/data-table";

import { useState } from "react";
import { useUsers } from "../../../hooks/users/use-users";
import { User } from "../../../types/users/user";
import { getUserColumns } from "./_components/user-columns";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { CreateUserDialog } from "./_components/create-user-dialog";
import { UpdateUserDialog } from "./_components/edit-user-dialog";
import { DeleteUserDialog } from "./_components/delete-user-dialog";
import { isAdmin } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "ADMIN" },
  { label: "Marketing Editor", value: "MARKETING_EDITOR" },
  { label: "Technical Editor", value: "TECHNICAL_EDITOR" },
  { label: "Viewer", value: "VIEWER" },
];

export default function UserManagementPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { users, loading, pagination, refetch } = useUsers({
    search: searchValue,
    role: selectedRole,
    page,
    limit,
  });

  const columns = getUserColumns({
    onEdit: (user) => setEditingUser(user),
    onDelete: (user) => setDeletingUser(user),
    isAdmin: isAdmin(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">User Management</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search users..."
          filterLabel="Role"
          filterValue={selectedRole}
          onFilterChange={setSelectedRole}
          filterOptions={ROLE_OPTIONS}
        />

        <CreateUserDialog onUserCreated={refetch} />
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(user) => user.id}
      />

      {editingUser && (
        <UpdateUserDialog
          user={editingUser}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingUser(null);
          }}
          onUserUpdated={() => {
            setEditingUser(null);
            refetch();
          }}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={true}
          canDelete={true}
          onOpenChange={(open) => {
            if (!open) setDeletingUser(null);
          }}
          onDeleted={() => {
            setDeletingUser(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
