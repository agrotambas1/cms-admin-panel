"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/api";
import { PaginationState } from "@/components/common/table/data-table";
import { MediaFile } from "../../types/media/media";
import { toast } from "sonner";
import { AxiosError } from "axios";

export interface MediaFilters {
  search?: string;
}

interface UseMediaParams extends MediaFilters {
  page: number;
  limit: number;
}

export function useMedia({ search, page, limit }: UseMediaParams) {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 40,
    total: 0,
  });

  const fetchMedia = async () => {
    try {
      setLoading(true);

      const { data } = await cmsApi.get("/media", {
        params: {
          search,
          page,
          limit,
        },
      });

      setMediaList(data.data || data.media || data);
      setPagination({
        page: data.meta?.page ?? page,
        limit: data.meta?.limit ?? limit,
        total: data.meta?.total ?? 0,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search, page, limit]);

  return {
    mediaList,
    loading,
    error,
    pagination,
    refetch: fetchMedia,
  };
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

export function useUploadMedia(onSuccess?: () => void) {
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: File[]) => {
    setUploading(true);

    let successCount = 0;
    const errors: string[] = [];

    try {
      for (const file of files) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          errors.push(`${file.name} - file type not allowed (${file.type})`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name} - file size exceeds 10MB`);
          continue;
        }

        try {
          const formData = new FormData();
          formData.append("file", file);

          await cmsApi.post("/media", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          successCount++;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          errors.push(`${file.name} failed to upload`);
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} ${successCount === 1 ? "file" : "files"} uploaded successfully`,
        );
        onSuccess?.();
      }

      if (errors.length > 0) {
        toast.error(
          `${errors.length} ${
            errors.length === 1 ? "file" : "files"
          } failed to upload`,
        );
      }

      return { success: successCount > 0, successCount, errors };
    } catch (error) {
      console.error("Upload error:", error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to upload images");
      } else {
        toast.error("Failed to upload images");
      }

      return { success: false, successCount: 0, errors: ["Upload failed"] };
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadFiles };
}

interface UseUpdateMediaParams {
  media: MediaFile;
  onSuccess?: () => void;
}

export function useUpdateMedia({ media, onSuccess }: UseUpdateMediaParams) {
  const [updating, setUpdating] = useState(false);

  const updateMedia = async (updates: Partial<MediaFile>) => {
    setUpdating(true);
    try {
      await cmsApi.put(`/media/${media.id}`, {
        title: updates.title ?? media.title,
        description: updates.description ?? media.description,
        altText: updates.altText ?? media.altText,
        caption: updates.caption ?? media.caption,
        url: updates.url ?? media.url,
      });

      toast.success("Successfully saved changes");

      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Update error:", error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to save changes");
      } else {
        toast.error("Failed to save changes");
      }

      return { success: false, error };
    } finally {
      setUpdating(false);
    }
  };

  return { updating, updateMedia };
}

interface UseDeleteMediaParams {
  onSuccess?: () => void;
}

export function useDeleteMedia({ onSuccess }: UseDeleteMediaParams = {}) {
  const [deleting, setDeleting] = useState(false);

  const deleteMedia = async (mediaId: string) => {
    setDeleting(true);

    try {
      await cmsApi.delete(`/media/${mediaId}`);

      toast.success("Successfully deleted media");

      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete media");
      } else {
        toast.error("Failed to delete media");
      }

      return { success: false, error };
    } finally {
      setDeleting(false);
    }
  };

  return { deleting, deleteMedia };
}

interface UseDeleteMediaBulkParams {
  onSuccess?: () => void;
}

export function useDeleteMediaBulk({
  onSuccess,
}: UseDeleteMediaBulkParams = {}) {
  const [deleting, setDeleting] = useState(false);

  const deleteMediaBulk = async (ids: string[]) => {
    if (ids.length === 0) {
      toast.error("No media selected");
      return { success: false, error: "No media selected" };
    }

    setDeleting(true);
    try {
      await cmsApi.delete("/media", {
        data: { ids },
      });

      toast.success(
        `${ids.length} ${
          ids.length === 1 ? "media" : "media"
        } deleted successfully`,
      );

      onSuccess?.();

      return { success: true, count: ids.length };
    } catch (error) {
      console.error("Bulk delete error:", error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete media");
      } else {
        toast.error("Failed to delete media");
      }

      return { success: false, error };
    } finally {
      setDeleting(false);
    }
  };

  return { deleting, deleteMediaBulk };
}

interface UseDownloadMediaParams {
  media: MediaFile;
}

export function useDownloadMedia({ media }: UseDownloadMediaParams) {
  const [downloading, setDownloading] = useState(false);

  const downloadMedia = async () => {
    try {
      setDownloading(true);

      const response = await cmsApi.get(`/media/download/${media.id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: media.mimeType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = media.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully");

      return { success: true };
    } catch (error) {
      console.error("Download failed:", error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to download file");
      } else {
        toast.error("Failed to download file");
      }

      return { success: false, error };
    } finally {
      setDownloading(false);
    }
  };

  return { downloading, downloadMedia };
}
