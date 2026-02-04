"use client";

import { useState } from "react";
import { getCapabilityColumns } from "./_components/capability-columns";
import { Capability } from "@/types/capability/capability";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { DataTable } from "@/components/common/table/data-table";
import { useCapabilities } from "@/hooks/capability/use-capability";
import { CreateCapabilityDialog } from "./_components/create-capability-dialog";
import { UpdateCapabilityDialog } from "./_components/edit-capability-dialog";
import { DeleteCapabilityDialog } from "./_components/delete-capability-dialog";

export default function CapabilityPage() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingCapability, setEditingCapability] = useState<Capability | null>(
    null,
  );
  const [deletingCapability, setDeletingCapability] =
    useState<Capability | null>(null);

  const { capabilities, loading, pagination, refetch } = useCapabilities({
    search: searchValue,
    page,
    limit,
  });

  const columns = getCapabilityColumns({
    onEdit: (capability) => setEditingCapability(capability),
    onDelete: (capability) => setDeletingCapability(capability),
  });

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Capabilities</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search capabilities..."
        />

        <CreateCapabilityDialog onCapabilityCreated={refetch} />
      </div>

      <DataTable
        columns={columns}
        data={capabilities}
        loading={loading}
        emptyMessage="No capabilities found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(category) => category.id}
      />

      {editingCapability && (
        <UpdateCapabilityDialog
          capability={editingCapability}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingCapability(null);
          }}
          onCapabilityUpdated={() => {
            setEditingCapability(null);
            refetch();
          }}
        />
      )}

      {deletingCapability && (
        <DeleteCapabilityDialog
          capability={deletingCapability}
          open={true}
          canDelete={true}
          onOpenChange={(open) => {
            if (!open) setDeletingCapability(null);
          }}
          onDeleted={() => {
            setDeletingCapability(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
