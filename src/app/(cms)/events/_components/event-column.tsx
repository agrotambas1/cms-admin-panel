import { ColumnDef } from "@/components/common/table/data-table";
import {
  TableAction,
  TableActionsMenu,
} from "@/components/common/table/table-action-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event/event";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface EventColumnsProps {
  onDelete: (event: Event) => void;
  onBulkDelete?: (eventIds: Set<string | number>) => void;
  canDelete: boolean;
  canEdit: boolean;
}

export function getEventColumns({
  onDelete,
  canDelete,
  canEdit,
}: EventColumnsProps): ColumnDef<Event>[] {
  return [
    {
      header: "Name",
      accessorKey: "eventName",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{event.eventName}</span>
          <span className="text-xs text-muted-foreground">{event.slug}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "eventType",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium capitalize">{event.eventType}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "eventType",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium capitalize">{event.eventType}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (event) => {
        const statusColors = {
          draft: "bg-gray-500",
          published: "bg-green-500",
        };

        return (
          <Badge
            className={`${statusColors[event.status as keyof typeof statusColors] || "bg-gray-500"} text-white`}
          >
            {event.status}
          </Badge>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "eventDate",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{format(event.eventDate, "PP")}</span>
        </div>
      ),
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{event.location || "-"}</span>
        </div>
      ),
    },
    {
      header: "Url",
      accessorKey: "meetingUrl",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{event.meetingUrl || "-"}</span>
        </div>
      ),
    },
    {
      header: "Quota",
      accessorKey: "quota",
      cell: (event) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{event.quota}</span>
        </div>
      ),
    },
    {
      header: "",
      cell: (event) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/events/view/${event.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {(canEdit || canDelete) && (
            <TableActionsMenu
              item={event}
              actions={[
                ...(canEdit
                  ? [
                      {
                        label: "Edit",
                        href: `/events/${event.id}/edit`,
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
