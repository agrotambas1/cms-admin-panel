import { ColumnDef } from "@/components/common/table/data-table";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/article/article";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ArticleColumnsProps {
  onDelete: (article: Article) => void;
  onBulkDelete?: (articleIds: Set<string | number>) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getArticleColumns({
  onDelete,
  canDelete,
  canEdit,
}: ArticleColumnsProps): ColumnDef<Article>[] {
  return [
    {
      header: "Title",
      accessorKey: "title",
      cell: (article) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{article.title}</span>
          <span className="text-xs text-muted-foreground">{article.slug}</span>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (article) => (
        <span className="text-sm">{article.category?.name || "-"}</span>
      ),
    },
    {
      header: "Tag",
      accessorKey: "tags",
      cell: (article) => (
        <div className="flex flex-wrap gap-1">
          {article.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          )) ?? <span className="text-muted-foreground">-</span>}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (article) => {
        const statusColors = {
          draft: "bg-gray-500",
          published: "bg-green-500",
          scheduled: "bg-blue-500",
        };

        return (
          <Badge
            className={`${statusColors[article.status as keyof typeof statusColors] || "bg-gray-500"} text-white`}
          >
            {article.status}
          </Badge>
        );
      },
    },
    {
      header: "Featured",
      cell: (article) => (
        <Badge
          className={
            article.isFeatured
              ? "bg-yellow-500 text-white"
              : "bg-gray-300 text-gray-700"
          }
        >
          {article.isFeatured ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      header: "Views",
      accessorKey: "viewCount",
      cell: (article) => (
        <span className="text-sm">{article.viewCount.toLocaleString()}</span>
      ),
    },
    {
      header: "Published At",
      cell: (article) => (
        <span className="text-sm">
          {article.publishedAt
            ? format(new Date(article.publishedAt), "MMM dd, yyyy")
            : "-"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (article) => (
        <span className="text-sm">
          {format(new Date(article.createdAt), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "",
      cell: (article) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/articles/view/${article.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {(canEdit || canDelete) && (
            <TableActionsMenu
              item={article}
              actions={[
                ...(canEdit
                  ? [
                      {
                        label: "Edit",
                        href: `/articles/${article.id}/edit`,
                        icon: <Pencil className="h-4 w-4" />,
                      },
                    ]
                  : []),
                ...(canDelete
                  ? [
                      {
                        label: "Delete",
                        onClick: onDelete,
                        variant: "destructive" as const,
                        icon: <Trash2 className="h-4 w-4 bg text-red-600" />,
                        separator: true,
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      ),
      className: "w-[50px]",
    },
  ];
}
