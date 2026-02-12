import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { Article, ArticleFilters } from "@/types/article/article";
import {
  CreateArticleForm,
  CreateArticleSchema,
  UpdateArticleForm,
  UpdateArticleSchema,
} from "@/validations/article/article-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { useCallback, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface useArticlesParams extends ArticleFilters {
  page: number;
  limit: number;
  isFeatured?: boolean;
  serviceId?: string;
  industryId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useArticles({
  search,
  status,
  categoryId,
  isFeatured,
  serviceId,
  industryId,
  page,
  limit,
  sortBy = "createdAt",
  order = "desc",
}: useArticlesParams) {
  const [article, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await cmsApi.get("/articles", {
        params: {
          search,
          status,
          categoryId,
          isFeatured,
          serviceId,
          industryId,
          page,
          limit,
          sortBy,
          order,
        },
      });

      setArticles(data.data || data.article || data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      });

      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch article");
    } finally {
      setLoading(false);
    }
  }, [
    search,
    status,
    categoryId,
    isFeatured,
    serviceId,
    industryId,
    page,
    limit,
    sortBy,
    order,
  ]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const refetch = () => fetchArticles();

  return { article, loading, error, pagination, refetch };
}

export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data } = await cmsApi.get(`/articles/${id}`);
        setArticle(data.data || data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return { article, loading, error };
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

export function useCreateArticle(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      thumbnailId: null,
      publicationId: null,
      metaTitle: "",
      metaDescription: "",
      seoKeywords: [],
      status: "draft",
      publishedAt: null,
      scheduledAt: null,
      isFeatured: false,
      categoryId: "",
      serviceId: "",
      industryId: "",
      tags: [],
    },
  }) as UseFormReturn<CreateArticleForm>;

  const handleTitleChange = (value: string) => {
    form.setValue("title", value, { shouldValidate: true });

    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(form.getValues("title")), {
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

  const createArticle = async (data: CreateArticleForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/articles", {
        ...data,
        tags: data.tags ?? [],
        seoKeywords: data.seoKeywords ?? [],
      });

      toast.success(`Article ${data.title} created successfully`);

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
            error.response?.data?.message || "Failed to create article",
          );
        }
      } else {
        toast.error("Failed to create article");
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
    createArticle,
  };
}

export function useUpdateArticle(id: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const form = useForm({
    resolver: zodResolver(UpdateArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      thumbnailId: null,
      publicationId: null,
      metaTitle: "",
      metaDescription: "",
      seoKeywords: [],
      status: "draft",
      publishedAt: null,
      scheduledAt: null,
      isFeatured: false,
      categoryId: "",
      serviceId: "",
      industryId: "",
      tags: [],
    },
  }) as UseFormReturn<UpdateArticleForm>;

  const { article, loading: articleLoading } = useArticle(id);

  useEffect(() => {
    if (article && !articleLoading) {
      form.reset({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        thumbnailId: article.thumbnailId,
        publicationId: article.publicationId,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        seoKeywords: article.seoKeywords || [],
        status: article.status as "draft" | "published" | "scheduled",
        publishedAt: article.publishedAt,
        scheduledAt: article.scheduledAt,
        isFeatured: article.isFeatured,
        categoryId: article.categoryId,
        serviceId: article.serviceId,
        industryId: article.industryId,
        tags: article.tags?.map((tag) => tag.id) || [],
      });
      setIsSlugTouched(true);
      setInitializing(false);
    }
  }, [article, articleLoading, form]);

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

  const updateArticle = async (data: UpdateArticleForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/articles/${id}`, {
        ...data,
        tags: data.tags ?? [],
        seoKeywords: data.seoKeywords ?? [],
      });

      toast.success(`Article ${data.title} updated successfully`);

      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error("Slug already exists. Please use a different name.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to update article",
          );
        }
      } else {
        toast.error("Failed to update article");
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    initializing: initializing || articleLoading,
    isSlugTouched,
    setIsSlugTouched,
    handleTitleChange,
    resetSlug,
    updateArticle,
    article,
  };
}

interface DeleteArticleParams {
  articleId: string;
  articleTitle: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteArticle({
  articleId,
  articleTitle,
  canDelete,
  onSuccess,
}: DeleteArticleParams) {
  const [loading, setLoading] = useState(false);

  const deleteArticle = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this article");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/articles/${articleId}`);

      toast.success(`Article ${articleTitle} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteArticle,
  };
}

interface BulkDeleteArticlesParams {
  onSuccess?: () => void;
}

export function useBulkDeleteArticles({ onSuccess }: BulkDeleteArticlesParams) {
  const [loading, setLoading] = useState(false);

  const bulkDeleteArticles = async (articleIds: Set<string | number>) => {
    if (articleIds.size === 0) {
      toast.error("No article selected");
      return { success: false };
    }

    setLoading(true);
    try {
      const deletePromises = Array.from(articleIds).map((id) =>
        cmsApi.delete(`/articles/${id}`),
      );

      await Promise.all(deletePromises);

      toast.success(
        `Successfully deleted ${articleIds.size} article${articleIds.size > 1 ? "s" : ""}`,
      );
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bulkDeleteArticles,
  };
}
