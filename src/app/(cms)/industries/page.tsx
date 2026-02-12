"use client";

import { useState } from "react";
import { getIndustryColumns } from "./_components/industry-columns";
import { Industry } from "@/types/industry/industry";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { DataTable } from "@/components/common/table/data-table";
import { useIndustries } from "@/hooks/industry/use-industry";
import { CreateIndustryDialog } from "./_components/create-industry-dialog";
import { UpdateIndustryDialog } from "./_components/edit-industry-dialog";
import { DeleteIndustryDialog } from "./_components/delete-industry-dialog";
import { canCreate, canDelete, canEdit } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

export default function IndustryPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [deletingIndustry, setDeletingIndustry] = useState<Industry | null>(
    null,
  );

  const { industries, loading, pagination, refetch } = useIndustries({
    search: searchValue,
    page,
    limit,
  });

  const columns = getIndustryColumns({
    onEdit: (industry) => setEditingIndustry(industry),
    onDelete: (industry) => setDeletingIndustry(industry),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Industries</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search industries..."
        />

        {canCreate(role) && (
          <CreateIndustryDialog onIndustryCreated={refetch} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={industries}
        loading={loading}
        emptyMessage="No industries found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(category) => category.id}
      />

      {editingIndustry && (
        <UpdateIndustryDialog
          industry={editingIndustry}
          open={true}
          canEdit={canEdit(role)}
          onOpenChange={(open) => {
            if (!open) setEditingIndustry(null);
          }}
          onIndustryUpdated={() => {
            setEditingIndustry(null);
            refetch();
          }}
        />
      )}

      {deletingIndustry && (
        <DeleteIndustryDialog
          industry={deletingIndustry}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingIndustry(null);
          }}
          onDeleted={() => {
            setDeletingIndustry(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
