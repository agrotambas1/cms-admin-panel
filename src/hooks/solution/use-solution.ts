"use client";

import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { Solution, SolutionFilters } from "@/types/solution/solution";
import {
  CreateSolutionForm,
  createSolutionSchema,
  UpdateSolutionForm,
  updateSolutionSchema,
} from "@/validations/solution/solution-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface useSolutionsParams extends SolutionFilters {
  page: number;
  limit: number;
}

export function useSolutions({ search, page, limit }: useSolutionsParams) {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);

        const { data } = await cmsApi.get("/solutions", {
          params: {
            search,
            page,
            limit,
          },
        });

        setSolutions(data.data || data.solutions || data);
        setPagination({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
        });
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch solutions");
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [search, page, limit]);

  const refetch = async () => {
    const { data } = await cmsApi.get("/solutions", {
      params: {
        search,
        page,
        limit,
      },
    });

    setSolutions(data.data || data.solutions || data);
    setPagination({
      page: data.meta?.page ?? page,
      limit: data.meta?.limit ?? limit,
      total: data.meta?.total ?? 0,
    });
  };

  return { solutions, loading, error, pagination, refetch };
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

export function useCreateSolution(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<CreateSolutionForm>({
    resolver: zodResolver(createSolutionSchema),
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

  const createSolution = async (data: CreateSolutionForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/solutions", data);

      toast.success(`Solution ${data.name} created successfully`);

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
            error.response?.data?.message || "Failed to create solution",
          );
        }
      } else {
        toast.error("Failed to create solution");
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createSolution,
  };
}

interface UseUpdateSolutionParams {
  solution: Solution;
  open: boolean;
  onSuccess?: () => void;
}

export function useUpdateSolution({
  solution,
  open,
  onSuccess,
}: UseUpdateSolutionParams) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<UpdateSolutionForm>({
    resolver: zodResolver(updateSolutionSchema),
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
        name: solution.name,
        slug: solution.slug,
        description: solution.description || "",
        isActive: solution.isActive ? "true" : "false",
      });
    }
  }, [open, solution, form]);

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

  const updateSolution = async (data: UpdateSolutionForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/solutions/${solution.id}`, {
        ...data,
        isActive: data.isActive === "true",
      });

      toast.success(`Solution ${data.name} updated successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Slug already exists.");
      } else {
        toast.error("Failed to update solution");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateSolution,
  };
}

interface DeleteSolutionParams {
  solutionId: string;
  solutionName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteSolution({
  solutionId,
  solutionName,
  canDelete,
  onSuccess,
}: DeleteSolutionParams) {
  const [loading, setLoading] = useState(false);

  const deleteSolution = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this solution");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/solutions/${solutionId}`);

      toast.success(`Solution ${solutionName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting solution:", error);

      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ?? "Failed to delete solution";

        if (error.response?.status === 409) {
          toast.error(
            message || "Solution cannot be deleted because it is still in use.",
          );
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Failed to delete solution");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteSolution,
  };
}
