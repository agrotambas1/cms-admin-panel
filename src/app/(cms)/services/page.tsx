"use client";

import { useState } from "react";
import { getServiceColumns } from "./_components/service-columns";
import { Service } from "@/types/service/service";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { DataTable } from "@/components/common/table/data-table";
import { useServices } from "@/hooks/service/use-service";
import { CreateServiceDialog } from "./_components/create-service-dialog";
import { UpdateServiceDialog } from "./_components/edit-service-dialog";
import { DeleteServiceDialog } from "./_components/delete-service-dialog";
import { canCreate, canDelete, canEdit } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

export default function ServicesPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const { services, loading, pagination, refetch } = useServices({
    search: searchValue,
    page,
    limit,
  });

  const columns = getServiceColumns({
    onEdit: (service) => setEditingService(service),
    onDelete: (service) => setDeletingService(service),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Services</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search services..."
        />

        {canCreate(role) && <CreateServiceDialog onServiceCreated={refetch} />}
      </div>

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        emptyMessage="No services found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(category) => category.id}
      />

      {editingService && (
        <UpdateServiceDialog
          service={editingService}
          open={true}
          canEdit={canEdit(role)}
          onOpenChange={(open) => {
            if (!open) setEditingService(null);
          }}
          onServiceUpdated={() => {
            setEditingService(null);
            refetch();
          }}
        />
      )}

      {deletingService && (
        <DeleteServiceDialog
          service={deletingService}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingService(null);
          }}
          onDeleted={() => {
            setDeletingService(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
