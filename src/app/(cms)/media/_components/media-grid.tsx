"use client";

import { MediaFile } from "../../../../types/media/media";
import { MediaThumbnail } from "./media-thumbnail";

interface MediaGridProps {
  mediaList: MediaFile[];
  selectedImageId?: string | null;
  bulkMode: boolean;
  selectedIds: string[];
  onToggleSelect: (item: MediaFile) => void;
  loading?: boolean;
}

export function MediaGrid({
  mediaList,
  selectedImageId,
  bulkMode,
  selectedIds,
  onToggleSelect,
  loading,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (mediaList.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <p className="text-muted-foreground">No media found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto ">
      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {mediaList.map((item) => {
          const isSelected = bulkMode
            ? selectedIds.includes(item.id)
            : selectedImageId === item.id;

          return (
            <MediaThumbnail
              key={item.id}
              item={item}
              isSelected={isSelected}
              onClick={() => onToggleSelect(item)}
            />
          );
        })}
      </div>
    </div>
  );
}
