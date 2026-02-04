"use client";

import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { Industry, IndustryFilters } from "@/types/industry/industry";
import {
  CreateIndustryForm,
  createIndustrySchema,
  UpdateIndustryForm,
  updateIndustrySchema,
} from "@/validations/industry/industry-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface useIndustriesParams extends IndustryFilters {
  page: number;
  limit: number;
}

export function useIndustries({ search, page, limit }: useIndustriesParams) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);

        const { data } = await cmsApi.get("/industries", {
          params: {
            search,
            page,
            limit,
          },
        });

        setIndustries(data.data || data.industries || data);
        setPagination({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
        });
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch industries");
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, [search, page, limit]);

  const refetch = async () => {
    const { data } = await cmsApi.get("/industries", {
      params: {
        search,
        page,
        limit,
      },
    });

    setIndustries(data.data || data.industries || data);
    setPagination({
      page: data.meta?.page ?? page,
      limit: data.meta?.limit ?? limit,
      total: data.meta?.total ?? 0,
    });
  };

  return { industries, loading, error, pagination, refetch };
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

export function useCreateIndustry(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<CreateIndustryForm>({
    resolver: zodResolver(createIndustrySchema),
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

  const createIndustry = async (data: CreateIndustryForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/industries", data);

      toast.success(`Industry ${data.name} created successfully`);

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
            error.response?.data?.message || "Failed to create industry",
          );
        }
      } else {
        toast.error("Failed to create industry");
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
    createIndustry,
  };
}

interface UseUpdateIndustryParams {
  industry: Industry;
  open: boolean;
  onSuccess?: () => void;
}

export function useUpdateIndustry({
  industry,
  open,
  onSuccess,
}: UseUpdateIndustryParams) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<UpdateIndustryForm>({
    resolver: zodResolver(updateIndustrySchema),
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
        name: industry.name,
        slug: industry.slug,
        description: industry.description || "",
        isActive: industry.isActive ? "true" : "false",
      });
    }
  }, [open, industry, form]);

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

  const updateIndustry = async (data: UpdateIndustryForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/industries/${industry.id}`, {
        ...data,
        isActive: data.isActive === "true",
      });

      toast.success(`Industry ${data.name} updated successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Slug already exists.");
      } else {
        toast.error("Failed to update industry");
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
    updateIndustry,
  };
}

interface DeleteIndustryParams {
  industryId: string;
  industryName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteIndustry({
  industryId,
  industryName,
  canDelete,
  onSuccess,
}: DeleteIndustryParams) {
  const [loading, setLoading] = useState(false);

  const deleteIndustry = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this industry");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/industries/${industryId}`);

      toast.success(`Industry ${industryName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting industry:", error);

      if (error instanceof AxiosError) {
        const meesage =
          error.response?.data?.message ?? "Failed to delete industry";

        if (error.response?.status === 409) {
          toast.error(
            meesage || "Industry cannot be deleted because it is still in use.",
          );
        } else {
          toast.error(meesage);
        }
      } else {
        toast.error("Failed to delete industry");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteIndustry,
  };
}
