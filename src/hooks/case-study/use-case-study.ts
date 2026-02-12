import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import { CaseStudy, CaseStudyFilters } from "@/types/case-study/case-study";
import {
  CreateCaseStudyForm,
  CreateCaseStudySchema,
  UpdateCaseStudyForm,
  UpdateCaseStudySchema,
} from "@/validations/case-study/case-study-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface UseCaseStudiesParams extends CaseStudyFilters {
  page: number;
  limit: number;
  isFeatured?: boolean;
  serviceId?: string;
  industryId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useCaseStudies({
  search,
  status,
  client,
  isFeatured,
  serviceId,
  industryId,
  page,
  limit,
  sortBy = "createdAt",
  order = "desc",
}: UseCaseStudiesParams) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchCaseStudies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await cmsApi.get("/case-studies", {
        params: {
          search,
          status,
          client,
          isFeatured,
          serviceId,
          industryId,
          page,
          limit,
          sortBy,
          order,
        },
      });

      setCaseStudies(data.data || data.caseStudies || data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      });
    } catch (error) {
      console.error(error);
      setError("Failed to fetch case studies");
    } finally {
      setLoading(false);
    }
  }, [
    search,
    status,
    client,
    isFeatured,
    serviceId,
    industryId,
    page,
    limit,
    sortBy,
    order,
  ]);

  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  const refetch = () => fetchCaseStudies();

  return { caseStudies, loading, error, pagination, refetch };
}

export function useCaseStudy(id: string) {
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        const { data } = await cmsApi.get(`/case-studies/${id}`);
        setCaseStudy(data.data || data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch case study");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCaseStudy();
    }
  }, [id]);

  return { caseStudy, loading, error };
}

export function useCreateCaseStudy(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateCaseStudySchema),
    defaultValues: {
      title: "",
      slug: "",
      overview: "",
      problem: "",
      solution: "",
      outcomesDesc: "",
      outcomes: [{ metric: "", value: "" }],
      client: "",
      thumbnailId: null,
      publicationId: null,
      metaTitle: "",
      metaDescription: "",
      seoKeywords: [],
      status: "draft",
      publishedAt: null,
      isFeatured: false,
      serviceId: "",
      industryId: "",
    },
  }) as UseFormReturn<CreateCaseStudyForm>;

  const handleTitleChange = (value: string) => {
    form.setValue("title", value, { shouldValidate: true });

    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(value), {
        shouldValidate: true,
      });
    }
  };

  const resetSlug = () => {
    setIsSlugTouched(false);
    form.setValue("slug", generateSlug(form.getValues("title")), {
      shouldValidate: true,
    });
  };

  const createCaseStudy = async (data: CreateCaseStudyForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/case-studies", {
        ...data,
        outcomes: data.outcomes || [],
        seoKeywords: data.seoKeywords || [],
      });

      toast.success(`Case study ${data.title} created successfully`);

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
            error.response?.data?.message || "Failed to create case study",
          );
        }
      } else {
        toast.error("Failed to create case study");
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
    handleTitleChange,
    resetSlug,
    createCaseStudy,
  };
}

export function useUpdateCaseStudy(id: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const form = useForm({
    resolver: zodResolver(UpdateCaseStudySchema),
    defaultValues: {
      title: "",
      slug: "",
      overview: "",
      problem: "",
      solution: "",
      outcomesDesc: "",
      outcomes: [],
      client: "",
      thumbnailId: null,
      publicationId: null,
      metaTitle: "",
      metaDescription: "",
      seoKeywords: [],
      status: "draft",
      publishedAt: null,
      isFeatured: false,
      serviceId: "",
      industryId: "",
    },
  }) as UseFormReturn<UpdateCaseStudyForm>;

  const { caseStudy, loading: caseStudyLoading } = useCaseStudy(id);

  useEffect(() => {
    if (caseStudy && !caseStudyLoading) {
      form.reset({
        title: caseStudy.title,
        slug: caseStudy.slug,
        overview: caseStudy.overview,
        problem: caseStudy.problem,
        solution: caseStudy.solution,
        outcomesDesc: caseStudy.outcomesDesc,
        outcomes: caseStudy.outcomes || [],
        client: caseStudy.client,
        thumbnailId: caseStudy.thumbnailId,
        publicationId: caseStudy.publicationId,
        metaTitle: caseStudy.metaTitle,
        metaDescription: caseStudy.metaDescription,
        seoKeywords: caseStudy.seoKeywords || [],
        status: caseStudy.status as
          | "draft"
          | "in technical review"
          | "in marketing review"
          | "approved"
          | "published"
          | "archived",
        publishedAt: caseStudy.publishedAt,
        isFeatured: caseStudy.isFeatured,
        serviceId: caseStudy.serviceId,
        industryId: caseStudy.industryId,
      });
      setIsSlugTouched(true);
      setInitializing(false);
    }
  }, [caseStudy, caseStudyLoading, form]);

  const handleTitleChange = (value: string) => {
    form.setValue("title", value, { shouldValidate: true });

    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(value), {
        shouldValidate: true,
      });
    }
  };

  const resetSlug = () => {
    setIsSlugTouched(false);
    form.setValue("slug", generateSlug(form.getValues("title")), {
      shouldValidate: true,
    });
  };

  const updateCaseStudy = async (data: UpdateCaseStudyForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/case-studies/${id}`, {
        ...data,
        outcomes: data.outcomes ?? [],
        seoKeywords: data.seoKeywords ?? [],
      });

      toast.success(`Case study ${data.title} updated successfully`);

      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error("Slug already exists. Please use a different name.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to update case study",
          );
        }
      } else {
        toast.error("Failed to update case study");
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    initializing: initializing || caseStudyLoading,
    isSlugTouched,
    setIsSlugTouched,
    handleTitleChange,
    resetSlug,
    updateCaseStudy,
    caseStudy,
  };
}

interface DeleteCaseStudyParams {
  caseStudyId: string;
  caseStudyTitle: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteCaseStudy({
  caseStudyId,
  caseStudyTitle,
  canDelete,
  onSuccess,
}: DeleteCaseStudyParams) {
  const [loading, setLoading] = useState(false);

  const deleteCaseStudy = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this case study");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/case-studies/${caseStudyId}`);
      toast.success(`Case study "${caseStudyTitle}" deleted successfully`);
      onSuccess?.();
      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to delete case study",
        );
      } else {
        toast.error("Failed to delete case study");
      }
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteCaseStudy,
  };
}

interface BulkDeleteCaseStudiesParams {
  onSuccess?: () => void;
}

export function useBulkDeleteCaseStudies({
  onSuccess,
}: BulkDeleteCaseStudiesParams) {
  const [loading, setLoading] = useState(false);

  const bulkDeleteCaseStudies = async (caseStudyIds: Set<string | number>) => {
    if (caseStudyIds.size === 0) {
      toast.error("No case study selected");
      return { success: false };
    }

    setLoading(true);
    try {
      const deletePromises = Array.from(caseStudyIds).map((id) =>
        cmsApi.delete(`/case-studies/${id}`),
      );

      await Promise.all(deletePromises);

      toast.success(
        `Successfully deleted ${caseStudyIds.size} case ${caseStudyIds.size > 1 ? "studies" : "study"}`,
      );
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting case studies:", error);
      toast.error("Failed to delete case studies");

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bulkDeleteCaseStudies,
  };
}
