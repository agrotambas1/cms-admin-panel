"use client";

import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { Tag, TagFilters } from "@/types/article/tag";
import {
  CreateTagForm,
  createTagSchema,
  UpdateTagForm,
  updateTagSchema,
} from "@/validations/article/tag-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface useTagsParams extends TagFilters {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useTags({
  search,
  page,
  limit,
  sortBy = "createdAt",
  order = "desc",
}: useTagsParams) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await cmsApi.get("/article-tags", {
        params: {
          search,
          page,
          limit,
          sortBy,
          order,
        },
      });

      setTags(data.data || data.tags || data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      });
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, sortBy, order]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const refetch = () => fetchTags();

  return { tags, loading, error, pagination, refetch };
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function useCreateTag(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<CreateTagForm>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const handleNameChange = (value: string) => {
    form.setValue("name", value, { shouldValidate: true });

    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(value), {
        shouldValidate: true,
      });
    }
  };

  const resetSlug = () => {
    setIsSlugTouched(false);
    form.setValue("slug", generateSlug(form.getValues("name")), {
      shouldValidate: true,
    });
  };

  const createTag = async (data: CreateTagForm) => {
    setLoading(false);
    try {
      await cmsApi.post("/article-tags", data);

      toast.success(`Tag ${data.name} created successfully`);

      form.reset();
      setIsSlugTouched(false);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error("Slug already exists. Please use a different name.");
        } else {
          toast.error(error.response?.data?.message || "Failed to create tag");
        }
      } else {
        toast.error("Failed to create tag");
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createTag,
  };
}

interface UseUpdateTagParams {
  tag: Tag;
  open: boolean;
  canEdit: boolean;
  onSuccess?: () => void;
}

export function useUpdateTag({
  tag,
  open,
  onSuccess,
  canEdit,
}: UseUpdateTagParams) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<UpdateTagForm>({
    resolver: zodResolver(updateTagSchema),
    defaultValues: {
      name: "",
      slug: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: tag.name,
        slug: tag.slug,
        isActive: tag.isActive ? "true" : "false",
      });
    }
  }, [open, tag, form]);

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const resetSlug = () => {
    setIsSlugTouched(false);
    form.setValue("slug", generateSlug(form.getValues("name")), {
      shouldValidate: true,
    });
  };

  const updateTag = async (data: UpdateTagForm) => {
    if (!canEdit) {
      toast.error("You are not allowed to update this tag");
      return { success: false };
    }

    setLoading(false);
    try {
      await cmsApi.put(`/article-tags/${tag.id}`, {
        ...data,
        isActive: data.isActive === "true",
      });

      toast.success(`Tag ${data.name} updated successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Slug already exists.");
      } else {
        toast.error("Failed to update tag");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateTag,
  };
}

interface DeleteTagParams {
  tagId: string;
  tagName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteTag({
  tagId,
  tagName,
  canDelete,
  onSuccess,
}: DeleteTagParams) {
  const [loading, setLoading] = useState(false);

  const deleteTag = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this tag");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/article-tags/${tagId}`);

      toast.success(`Tag ${tagName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting tag:", error);

      if (error instanceof AxiosError) {
        const message = error.response?.data?.message ?? "Failed to delete tag";

        if (error.response?.status === 409) {
          toast.error(
            message || "Solution cannot be deleted because it is still in use.",
          );
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Failed to delete tag");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteTag };
}
