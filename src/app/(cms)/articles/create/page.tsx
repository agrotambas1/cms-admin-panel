"use client";

import { useRouter } from "next/navigation";

import { useCategories } from "@/hooks/articles/use-category";
import { ArticleForm } from "../_components/article-form";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCreateArticle } from "@/hooks/articles/use-article";
import { useTags } from "@/hooks/articles/use-tag";
import { CreateArticleForm } from "@/validations/article/article-validation";
import { useServices } from "@/hooks/service/use-service";
import { useIndustries } from "@/hooks/industry/use-industry";
import { PermissionGuard } from "@/components/common/permission-guard";
import { canCreate } from "@/lib/permission";
import { SkeletonForm } from "@/components/common/skeleton-form";

export default function CreateArticlePage() {
  const router = useRouter();

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleTitleChange,
    resetSlug,
    createArticle,
  } = useCreateArticle(() => {
    router.push("/articles");
  });

  const { categories, loading: categoriesLoading } = useCategories({
    search: "",
    page: 1,
    limit: 100,
  });

  const { tags, loading: tagsLoading } = useTags({
    search: "",
    page: 1,
    limit: 100,
  });

  const { services, loading: servicesLoading } = useServices({
    search: "",
    page: 1,
    limit: 100,
  });

  const { industries, loading: industriesLoading } = useIndustries({
    search: "",
    page: 1,
    limit: 100,
  });

  const onSubmit = async (data: CreateArticleForm) => {
    await createArticle(data);
  };

  if (
    categoriesLoading ||
    tagsLoading ||
    servicesLoading ||
    industriesLoading
  ) {
    return <SkeletonForm />;
  }

  return (
    <PermissionGuard check={canCreate}>
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/articles">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Create New Article</h1>
          </div>
        </div>

        <ArticleForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          isSlugTouched={isSlugTouched}
          setIsSlugTouched={setIsSlugTouched}
          handleTitleChange={handleTitleChange}
          resetSlug={resetSlug}
          categories={categories}
          tags={tags}
          services={services}
          industries={industries}
          submitLabel="Create Article"
          initialThumbnail={null}
          initialPublication={null}
        />
      </div>
    </PermissionGuard>
  );
}
