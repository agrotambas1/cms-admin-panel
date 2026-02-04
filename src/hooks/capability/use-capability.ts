"use client";

import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { Capability, CapabilityFilters } from "@/types/capability/capability";
import {
  CreateCapabilityForm,
  createCapabilitySchema,
  UpdateCapabilityForm,
  updateCapabilitySchema,
} from "@/validations/capability/capability-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface useCapabilitiesParams extends CapabilityFilters {
  page: number;
  limit: number;
}

export function useCapabilities({
  search,
  page,
  limit,
}: useCapabilitiesParams) {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        setLoading(true);

        const { data } = await cmsApi.get("/capabilities", {
          params: {
            search,
            page,
            limit,
          },
        });

        setCapabilities(data.data || data.capabilities || data);
        setPagination({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
        });
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch capabilities");
      } finally {
        setLoading(false);
      }
    };

    fetchCapabilities();
  }, [search, page, limit]);

  const refetch = async () => {
    const { data } = await cmsApi.get("/capabilities", {
      params: {
        search,
        page,
        limit,
      },
    });

    setCapabilities(data.data || data.capabilities || data);
    setPagination({
      page: data.meta?.page ?? page,
      limit: data.meta?.limit ?? limit,
      total: data.meta?.total ?? 0,
    });
  };

  return { capabilities, loading, error, pagination, refetch };
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

export function useCreateCapability(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<CreateCapabilityForm>({
    resolver: zodResolver(createCapabilitySchema),
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

  const createCapability = async (data: CreateCapabilityForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/capabilities", data);

      toast.success(`Capability ${data.name} created successfully`);

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
            error.response?.data?.message || "Failed to create capability",
          );
        }
      } else {
        toast.error("Failed to create capability");
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
    createCapability,
  };
}

interface UseUpdateCapabilityParams {
  capability: Capability;
  open: boolean;
  onSuccess?: () => void;
}

export function useUpdateCapability({
  capability,
  open,
  onSuccess,
}: UseUpdateCapabilityParams) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<UpdateCapabilityForm>({
    resolver: zodResolver(updateCapabilitySchema),
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
        name: capability.name,
        slug: capability.slug,
        description: capability.description || "",
        isActive: capability.isActive ? "true" : "false",
      });
    }
  }, [open, capability, form]);

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

  const updateCapability = async (data: UpdateCapabilityForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/capabilities/${capability.id}`, {
        ...data,
        isActive: data.isActive === "true",
      });

      toast.success(`Capability ${data.name} updated successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Slug already exists.");
      } else {
        toast.error("Failed to update capability");
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
    updateCapability,
  };
}

interface DeleteCapabilityParams {
  capabilityId: string;
  capabilityName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteCapability({
  capabilityId,
  capabilityName,
  canDelete,
  onSuccess,
}: DeleteCapabilityParams) {
  const [loading, setLoading] = useState(false);

  const deleteCapability = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this capability");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/capabilities/${capabilityId}`);

      toast.success(`Capability ${capabilityName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting capability:", error);

      if (error instanceof AxiosError) {
        const meesage =
          error.response?.data?.message ?? "Failed to delete capability";

        if (error.response?.status === 409) {
          toast.error(
            meesage ||
              "Capability cannot be deleted because it is still in use.",
          );
        } else {
          toast.error(meesage);
        }
      } else {
        toast.error("Failed to delete capability");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteCapability,
  };
}
