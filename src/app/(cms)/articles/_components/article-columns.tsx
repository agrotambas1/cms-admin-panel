import { ColumnDef } from "@/components/common/table/data-table";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types/article/article";
import { format } from "date-fns";

interface ArticleColumnsProps {
  onDelete: (article: Article) => void;
  onBulkDelete?: (articleIds: Set<string | number>) => void;
}

export function getArticleColumns({
  onDelete,
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
      cell: (article) => {
        const actions: TableAction<Article>[] = [
          // ...(onView
          //   ? [
          //       {
          //         label: "View",
          //         onClick: onView,
          //       },
          //     ]
          //   : []),
          // {
          //   label: "Edit",
          //   onClick: onEdit,
          // },
          {
            label: "View",
            href: `/articles/view/${article.id}`,
          },
          {
            label: "Edit",
            href: `/articles/${article.id}/edit`,
          },
          {
            label: "Delete",
            onClick: onDelete,
            variant: "destructive" as const,
            separator: true,
          },
        ];

        return <TableActionsMenu item={article} actions={actions} />;
      },
      className: "w-[50px]",
    },
  ];
}
