"use client";

import { useState } from "react";

import { SearchFilter } from "@/components/common/filters/search-filter";

import { useCategories } from "@/hooks/articles/use-category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Article } from "@/types/article/article";
import { useArticles } from "@/hooks/articles/use-article";
import { DataTable } from "@/components/common/table/data-table";
import { getArticleColumns } from "./_components/article-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteArticleDialog } from "./_components/delete-article-dialog";
import { BulkDeleteArticlesDialog } from "./_components/bulk-delete-article-dialog";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { canBulkDelete, canCreate, canDelete, canEdit } from "@/lib/permission";

export default function ArticlesPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>();

  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const { article, loading, pagination, refetch } = useArticles({
    search: searchValue,
    status: statusFilter,
    categoryId: categoryFilter,
    isFeatured: featuredFilter,
    page,
    limit,
  });

  const { categories } = useCategories({
    search: "",
    page: 1,
    limit: 100,
  });

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const columns = getArticleColumns({
    onDelete: (article) => setDeletingArticle(article),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Articles</h1>

      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search articles..."
          />

          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter || "all"}
            onValueChange={(value) =>
              setCategoryFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              featuredFilter === undefined
                ? "all"
                : featuredFilter
                  ? "featured"
                  : "not-featured"
            }
            onValueChange={(value) =>
              setFeaturedFilter(
                value === "all"
                  ? undefined
                  : value === "featured"
                    ? true
                    : false,
              )
            }
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Articles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Articles</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="not-featured">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {canCreate(role) && (
          <Button asChild>
            <Link href="/articles/create">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Link>
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={article}
        loading={loading}
        emptyMessage="No articles found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(article) => article.id}
        enableRowSelection={canBulkDelete(role)}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onDeleteSelected={canBulkDelete(role) ? handleBulkDelete : undefined}
      />

      {deletingArticle && (
        <DeleteArticleDialog
          article={deletingArticle}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingArticle(null);
          }}
          onDeleted={() => {
            setDeletingArticle(null);
            refetch();
          }}
        />
      )}

      {bulkDeleteDialogOpen && (
        <BulkDeleteArticlesDialog
          selectedIds={selectedRows}
          open={true}
          onOpenChange={setBulkDeleteDialogOpen}
          onDeleted={() => {
            setSelectedRows(new Set());
            refetch();
          }}
        />
      )}
    </div>
  );
}
