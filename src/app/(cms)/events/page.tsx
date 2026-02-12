"use client";

import { useState } from "react";
import { SearchFilter } from "@/components/common/filters/search-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/event/event";
import { useEvents } from "@/hooks/event/use-event";
import { DataTable } from "@/components/common/table/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getEventColumns } from "./_components/event-column";
import { DeleteEventDialog } from "./_components/delete-event-dialog";
import { BulkDeleteEventDialog } from "./_components/bulk-delete-event-dialog";
import { canBulkDelete, canCreate, canDelete, canEdit } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

export default function EventPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const { events, loading, pagination, refetch } = useEvents({
    search: searchValue,
    status: statusFilter,
    page,
    limit,
  });

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const columns = getEventColumns({
    onDelete: (event) => setDeletingEvent(event),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Events</h1>

      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search events..."
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
            </SelectContent>
          </Select>
        </div>

        {canCreate(role) && (
          <Button asChild>
            <Link href="/events/create">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        emptyMessage="No events found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(event) => event.id}
        enableRowSelection={canBulkDelete(role)}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onDeleteSelected={canBulkDelete(role) ? handleBulkDelete : undefined}
      />

      {deletingEvent && (
        <DeleteEventDialog
          event={deletingEvent}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingEvent(null);
          }}
          onDeleted={() => {
            setDeletingEvent(null);
            refetch();
          }}
        />
      )}

      {bulkDeleteDialogOpen && (
        <BulkDeleteEventDialog
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
