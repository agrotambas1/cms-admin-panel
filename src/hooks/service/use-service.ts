"use client";

import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import { Service, ServiceFilters } from "@/types/service/service";
import {
  CreateServiceForm,
  createServiceSchema,
  UpdateServiceForm,
  updateServiceSchema,
} from "@/validations/service/service-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface useServicesParams extends ServiceFilters {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useServices({
  search,
  page,
  limit,
  sortBy = "createdAt",
  order = "desc",
}: useServicesParams) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await cmsApi.get("/services", {
        params: {
          search,
          page,
          limit,
          sortBy,
          order,
        },
      });

      setServices(data.data || data.services || data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      });
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, sortBy, order]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const refetch = () => fetchServices();

  return { services, loading, error, pagination, refetch };
}

export function useCreateService(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<CreateServiceForm>({
    resolver: zodResolver(createServiceSchema),
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

  const createService = async (data: CreateServiceForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/services", data);

      toast.success(`Service ${data.name} created successfully`);

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
            error.response?.data?.message || "Failed to create service",
          );
        }
      } else {
        toast.error("Failed to create service");
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
    createService,
  };
}

interface UseUpdateServiceParams {
  service: Service;
  open: boolean;
  onSuccess?: () => void;
  canEdit: boolean;
}

export function useUpdateService({
  service,
  open,
  canEdit,
  onSuccess,
}: UseUpdateServiceParams) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm<UpdateServiceForm>({
    resolver: zodResolver(updateServiceSchema),
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
        name: service.name,
        slug: service.slug,
        description: service.description || "",
        isActive: service.isActive ? "true" : "false",
      });
    }
  }, [open, service, form]);

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

  const updateService = async (data: UpdateServiceForm) => {
    if (!canEdit) {
      toast.error("You are not allowed to update this service");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.put(`/services/${service.id}`, {
        ...data,
        isActive: data.isActive === "true",
      });

      toast.success(`Service ${data.name} updated successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Slug already exists.");
      } else {
        toast.error("Failed to update service");
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
    updateService,
  };
}

interface DeleteServiceParams {
  serviceId: string;
  serviceName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteService({
  serviceId,
  serviceName,
  canDelete,
  onSuccess,
}: DeleteServiceParams) {
  const [loading, setLoading] = useState(false);

  const deleteService = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this service");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/services/${serviceId}`);

      toast.success(`Service ${serviceName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting service:", error);

      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ?? "Failed to delete service";

        if (error.response?.status === 409) {
          toast.error(
            message || "Service cannot be deleted because it is still in use.",
          );
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Failed to delete service");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteService,
  };
}
