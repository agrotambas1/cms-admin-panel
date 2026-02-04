"use client";

import { useState } from "react";
import { MediaFile } from "../../../../types/media/media";
import { MediaDetailPanel } from "./media-detail-panel";
import { MediaGrid } from "./media-grid";
import { Button } from "@/components/ui/button";
import { DeleteMediaBulkDialog } from "./delete-media-bulk-dialog";
import { PaginationState } from "@/components/common/table/data-table";
import { DataTablePagination } from "@/components/common/table/data-table-pagination";
import { X } from "lucide-react";

interface MediaLibraryTabProps {
  mediaList: MediaFile[];
  selectedImage: MediaFile | null;
  onSelectImage: (item: MediaFile | null) => void;
  onUpdateDetail: (field: keyof MediaFile, value: string) => void;
  onDeleteSuccess: () => void;
  loading?: boolean;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  bulkMode: boolean;
  onExitBulkMode: () => void;
}

export function MediaLibraryTab({
  mediaList,
  selectedImage,
  onSelectImage,
  onUpdateDetail,
  onDeleteSuccess,
  pagination,
  onPageChange,
  onLimitChange,
  loading,
  bulkMode,
  onExitBulkMode,
}: MediaLibraryTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleToggleSelect = (item: MediaFile) => {
    if (!bulkMode) {
      onSelectImage(item);
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id],
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative overflow-hidden space-y-6">
        <div className="flex-1 overflow-hidden">
          <MediaGrid
            mediaList={mediaList}
            selectedIds={selectedIds}
            selectedImageId={selectedImage?.id}
            bulkMode={bulkMode}
            onToggleSelect={handleToggleSelect}
            loading={loading}
          />
        </div>

        <div className="bg-background px-2 py-2">
          <DataTablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </div>
      </div>

      {selectedIds.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setSelectedIds([]);
                onSelectImage(null);
              }}
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              {selectedIds.length} item selected
            </span>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <MediaDetailPanel
        selectedImage={selectedImage}
        onClose={() => onSelectImage(null)}
        onUpdate={onUpdateDetail}
        onDelete={onDeleteSuccess}
      />

      <DeleteMediaBulkDialog
        ids={selectedIds}
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onDeleted={() => {
          setSelectedIds([]);
          onExitBulkMode();
          onDeleteSuccess();
        }}
      />
    </div>
  );
}
