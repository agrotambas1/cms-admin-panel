import { ColumnDef } from "@/components/common/table/data-table";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseStudy } from "@/types/case-study/case-study";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface CaseStudyColumnsProps {
  onDelete: (caseStudy: CaseStudy) => void;
  onBulkDelete?: (caseStudyIds: Set<string | number>) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getCaseStudyColumns({
  onDelete,
  canDelete,
  canEdit,
}: CaseStudyColumnsProps): ColumnDef<CaseStudy>[] {
  return [
    {
      header: "Title",
      accessorKey: "title",
      cell: (caseStudy) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{caseStudy.title}</span>
          <span className="text-xs text-muted-foreground">
            {caseStudy.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Service",
      cell: (caseStudy) => (
        <span className="text-sm">{caseStudy.service?.name || "-"}</span>
      ),
    },
    {
      header: "Industry",
      cell: (caseStudy) => (
        <span className="text-sm">{caseStudy.industry?.name || "-"}</span>
      ),
    },
    {
      header: "Client",
      accessorKey: "client",
      cell: (caseStudy) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm">{caseStudy.client}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (caseStudy) => {
        const statusColors = {
          draft: "bg-gray-500",
          published: "bg-green-500",
          scheduled: "bg-blue-500",
        };

        return (
          <Badge
            className={`${statusColors[caseStudy.status as keyof typeof statusColors] || "bg-gray-500"} text-white`}
          >
            {caseStudy.status}
          </Badge>
        );
      },
    },
    {
      header: "Created At",
      cell: (caseStudy) => (
        <span className="text-sm">
          {format(new Date(caseStudy.createdAt), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "",
      cell: (caseStudy) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/case-studies/view/${caseStudy.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {(canEdit || canDelete) && (
            <TableActionsMenu
              item={caseStudy}
              actions={[
                ...(canEdit
                  ? [
                      {
                        label: "Edit",
                        href: `/case-studies/${caseStudy.id}/edit`,
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
      className: "w-[100px]",
    },
  ];
}
