"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Video, X } from "lucide-react";
import { useState } from "react";
import { MediaFile } from "../../../../types/media/media";
import { DeleteMediaDialog } from "./delete-media-dialog";
import { useDownloadMedia, useUpdateMedia } from "@/hooks/media/use-media";
import { getMediaUrl } from "@/lib/media-utils";
import { cmsApi } from "@/lib/api";
import { toast } from "sonner";

interface MediaDetailPanelProps {
  selectedImage: MediaFile | null;
  onClose: () => void;
  onUpdate: (field: keyof MediaFile, value: string) => void;
  onDelete: () => void;
}

export function MediaDetailPanel({
  selectedImage,
  onClose,
  onUpdate,
  onDelete,
}: MediaDetailPanelProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { updating, updateMedia } = useUpdateMedia({
    media: selectedImage!,
    onSuccess: () => {},
  });

  const { downloading, downloadMedia } = useDownloadMedia({
    media: selectedImage!,
  });

  if (!selectedImage) return null;

  const mediaUrl = getMediaUrl(selectedImage.url);

  const isImage = selectedImage.mimeType?.startsWith("image/");
  const isVideo = selectedImage.mimeType?.startsWith("video/");
  const isPDF = selectedImage.mimeType === "application/pdf";

  const handleSave = async () => {
    await updateMedia({
      title: selectedImage.title,
      description: selectedImage.description,
      altText: selectedImage.altText,
      caption: selectedImage.caption,
      url: selectedImage.url,
    });
  };

  return (
    <>
      <div className="w-80 lg:w-96 border-l ps-6 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-wider">
              Attachment Details
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="rounded-md overflow-hidden border">
            {isImage && (
              <img src={mediaUrl} alt="Preview" className="w-full h-auto" />
            )}

            {isVideo && (
              <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6">
                <Video className="w-16 h-16 text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {selectedImage.fileName}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedImage.fileSize
                    ? `${(selectedImage.fileSize / 1024 / 1024).toFixed(2)} MB`
                    : "-"}
                </p>
              </div>
            )}

            {isPDF && (
              <div className="w-full aspect-video bg-red-50 dark:bg-red-950/20 flex flex-col items-center justify-center p-6">
                <FileText className="w-16 h-16 text-red-500 mb-3" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {selectedImage.fileName}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  {selectedImage.fileSize
                    ? `${(selectedImage.fileSize / 1024 / 1024).toFixed(2)} MB`
                    : "-"}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={downloadMedia}
            disabled={downloading}
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? "Downloading..." : "Download File"}
          </Button>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedImage.title ?? ""}
                onChange={(e) => onUpdate("title", e.target.value)}
                placeholder="Title..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                value={selectedImage.altText ?? ""}
                onChange={(e) => onUpdate("altText", e.target.value)}
                placeholder="Alt text..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="url">URL</Label>
              <Input id="url" value={mediaUrl} readOnly />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={3}
                value={selectedImage.caption ?? ""}
                onChange={(e) => onUpdate("caption", e.target.value)}
                placeholder="Caption..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={selectedImage.description ?? ""}
                onChange={(e) => onUpdate("description", e.target.value)}
                placeholder="Description..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>

            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete Attachment
            </Button>
          </div>
        </div>
      </div>

      <DeleteMediaDialog
        media={selectedImage}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          onDelete();
          onClose();
        }}
      />
    </>
  );
}
