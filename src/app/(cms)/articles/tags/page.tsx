"use client";

import { useTags } from "@/hooks/articles/use-tag";
import { Tag } from "@/types/article/tag";
import { useState } from "react";
import { getTagColumns } from "./_components/tag-columns";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { DataTable } from "@/components/common/table/data-table";
import { CreateTagDialog } from "./_components/create-tag-dialog";
import { UpdateTagDialog } from "./_components/edit-tag-dialog";
import { DeleteTagDialog } from "./_components/delete-tag-dialog";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { canCreate, canDelete, canEdit } from "@/lib/permission";

export default function ArticleTagsPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  const { tags, loading, pagination, refetch } = useTags({
    search: searchValue,
    page,
    limit,
  });

  const columns = getTagColumns({
    onEdit: (tag) => setEditingTag(tag),
    onDelete: (tag) => setDeletingTag(tag),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Article Tags</h1>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search tags..."
        />

        {canCreate(role) && <CreateTagDialog onTagCreated={refetch} />}
      </div>

      <DataTable
        columns={columns}
        data={tags}
        loading={loading}
        emptyMessage="No tags found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(tag) => tag.id}
      />

      {editingTag && (
        <UpdateTagDialog
          tag={editingTag}
          open={true}
          canEdit={canEdit(role)}
          onOpenChange={(open) => {
            if (!open) setEditingTag(null);
          }}
          onTagUpdated={() => {
            setEditingTag(null);
            refetch();
          }}
        />
      )}

      {deletingTag && (
        <DeleteTagDialog
          tag={deletingTag}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingTag(null);
          }}
          onDeleted={() => {
            setDeletingTag(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
