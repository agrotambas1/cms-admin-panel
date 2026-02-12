"use client";

import { useState } from "react";
import { getCategoryColumns } from "./_components/category-columns";
import { Category } from "../../../../types/article/category";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { DataTable } from "@/components/common/table/data-table";
import { useCategories } from "../../../../hooks/articles/use-category";
import { CreateCategoryDialog } from "./_components/create-category-dialog";
import { UpdateCategoryDialog } from "./_components/edit-category-dialog";
import { DeleteCategoryDialog } from "./_components/delete-category-dialog";
import { canCreate, canDelete, canEdit } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

export default function ArticlesCategoriesPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const { categories, loading, pagination, refetch } = useCategories({
    search: searchValue,
    page,
    limit,
  });

  const columns = getCategoryColumns({
    onEdit: (category) => setEditingCategory(category),
    onDelete: (category) => setDeletingCategory(category),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Article Categories</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search categories..."
        />

        {canCreate(role) && (
          <CreateCategoryDialog onCategoryCreated={refetch} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(category) => category.id}
      />

      {editingCategory && (
        <UpdateCategoryDialog
          category={editingCategory}
          open={true}
          canEdit={canEdit(role)}
          onOpenChange={(open) => {
            if (!open) setEditingCategory(null);
          }}
          onCategoryUpdated={() => {
            setEditingCategory(null);
            refetch();
          }}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingCategory(null);
          }}
          onDeleted={() => {
            setDeletingCategory(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
