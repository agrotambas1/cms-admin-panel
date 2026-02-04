"use client";

import { FileText, Image as ImageIcon, Video } from "lucide-react";
import { MediaFile } from "../../../../types/media/media";
import { getMediaUrl } from "@/lib/media-utils";

interface MediaThumbnailProps {
  item: MediaFile;
  isSelected: boolean;
  onClick: () => void;
}

export function MediaThumbnail({
  item,
  isSelected,
  onClick,
}: MediaThumbnailProps) {
  const imageUrl = getMediaUrl(item.url);

  const isImage = item.mimeType?.startsWith("image/");
  const isVideo = item.mimeType?.startsWith("video/");
  const isPDF = item.mimeType === "application/pdf";

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer border-4 rounded-lg overflow-hidden w-[150px] h-[150px] transition-all
        ${
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-transparent shadow-sm"
        }
      `}
    >
      {isImage && (
        <img
          src={imageUrl}
          alt={item.altText || item.fileName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {isVideo && (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center">
          <Video className="w-12 h-12 text-slate-400 mb-2" />
          <p className="text-xs text-slate-500 text-center px-2 truncate w-full">
            {item.fileName}
          </p>
        </div>
      )}

      {isPDF && (
        <div className="w-full h-full bg-red-50 dark:bg-red-950/20 flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-xs text-red-600 dark:text-red-400 text-center px-2 truncate w-full">
            {item.fileName}
          </p>
        </div>
      )}

      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
          <ImageIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
