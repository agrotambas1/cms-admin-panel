"use client";

import { useState } from "react";
import { getSolutionColumns } from "./_components/solution-columns";
import { Solution } from "@/types/solution/solution";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { DataTable } from "@/components/common/table/data-table";
import { useSolutions } from "@/hooks/solution/use-solution";
import { CreateSolutionDialog } from "./_components/create-solution-dialog";
import { UpdateSolutionDialog } from "./_components/edit-solution-dialog";
import { DeleteSolutionDialog } from "./_components/delete-solution-dialog";

export default function SolutionsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [deletingSolution, setDeletingSolution] = useState<Solution | null>(
    null,
  );

  const { solutions, loading, pagination, refetch } = useSolutions({
    search: searchValue,
    page,
    limit,
  });

  const columns = getSolutionColumns({
    onEdit: (solution) => setEditingSolution(solution),
    onDelete: (solution) => setDeletingSolution(solution),
  });

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Solutions</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search solutions..."
        />

        <CreateSolutionDialog onSolutionCreated={refetch} />
      </div>

      <DataTable
        columns={columns}
        data={solutions}
        loading={loading}
        emptyMessage="No solutions found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(category) => category.id}
      />

      {editingSolution && (
        <UpdateSolutionDialog
          solution={editingSolution}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingSolution(null);
          }}
          onSolutionUpdated={() => {
            setEditingSolution(null);
            refetch();
          }}
        />
      )}

      {deletingSolution && (
        <DeleteSolutionDialog
          solution={deletingSolution}
          open={true}
          canDelete={true}
          onOpenChange={(open) => {
            if (!open) setDeletingSolution(null);
          }}
          onDeleted={() => {
            setDeletingSolution(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
