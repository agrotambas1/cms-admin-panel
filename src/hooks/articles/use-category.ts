"use client";

import { useState, useEffect, useCallback } from "react";

import { Category, CategoryFilters } from "../../types/article/category";
import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { useForm } from "react-hook-form";
import {
  CreateCategoryForm,
  createCategorySchema,
  UpdateCategoryForm,
  updateCategorySchema,
} from "@/validations/article/category-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface useCategoriesParams extends CategoryFilters {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useCategories({
  search,
  page,
  limit,
  sortBy = "createdAt",
  order = "desc",
}: useCategoriesParams) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await cmsApi.get("/article-categories", {
        params: {
          search,
          page,
          limit,
          sortBy,
          order,
        },
      });

      setCategories(data.data || data.categories || data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      });
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, sortBy, order]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = () => fetchCategories();

  return {
    categories,
    loading,
    error,
    pagination,
    refetch,
  };
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

export function useCreateCategory(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
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

  const createCategory = async (data: CreateCategoryForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/article-categories", data);

      toast.success(`Category ${data.name} created successfully`);

      form.reset();
      setIsSlugTouched(false);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error("Slug already exists. Please use a different name.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to create category",
          );
        }
      } else {
        toast.error("Failed to create category");
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
    createCategory,
  };
}

interface UseUpdateCategoryParams {
  category: Category;
  open: boolean;
  canEdit: boolean;
  onSuccess?: () => void;
}

export function useUpdateCategory({
  category,
  open,
  canEdit,
  onSuccess,
}: UseUpdateCategoryParams) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<UpdateCategoryForm>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        isActive: category.isActive ? "true" : "false",
      });
      setIsSlugTouched(false);
    }
  }, [open, category, form]);

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

  const updateCategory = async (data: UpdateCategoryForm) => {
    if (!canEdit) {
      toast.error("You are not allowed to update this category");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.put(`/article-categories/${category.id}`, {
        ...data,
        isActive: data.isActive === "true",
      });

      toast.success(`Category ${data.name} updated successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Slug already exists.");
      } else {
        toast.error("Failed to update category");
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
    updateCategory,
  };
}

interface DeleteCategoryParams {
  categoryId: string;
  categoryName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteCategory({
  categoryId,
  categoryName,
  canDelete,
  onSuccess,
}: DeleteCategoryParams) {
  const [loading, setLoading] = useState(false);

  const deleteCategory = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this category");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/article-categories/${categoryId}`);

      toast.success(`Category ${categoryName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting categories:", error);

      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ?? "Failed to delete categories";

        if (error.response?.status === 409) {
          toast.error(
            message || "Solution cannot be deleted because it is still in use.",
          );
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Failed to delete categories");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteCategory,
  };
}
