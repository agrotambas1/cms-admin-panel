"use client";

import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/articles/use-category";
import { ArticleForm } from "../../_components/article-form";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUpdateArticle } from "@/hooks/articles/use-article";
import { useTags } from "@/hooks/articles/use-tag";
import { UpdateArticleForm } from "@/validations/article/article-validation";
import { MediaFile } from "@/types/media/media";
import { use } from "react";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: articleId } = use(params);

  const {
    form,
    loading,
    initializing,
    isSlugTouched,
    setIsSlugTouched,
    handleTitleChange,
    resetSlug,
    updateArticle,
    article,
  } = useUpdateArticle(articleId, () => {
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

  const onSubmit = async (data: UpdateArticleForm) => {
    await updateArticle(data);
  };

  const getInitialThumbnail = (): MediaFile | null => {
    if (!article?.thumbnailMedia) return null;

    return {
      id: article.thumbnailMedia.id,
      url: article.thumbnailMedia.url,
      title: article.thumbnailMedia.fileName,
      fileName: article.thumbnailMedia.fileName,
      altText: "",
      caption: "",
      description: "",
    };
  };

  if (initializing || categoriesLoading || tagsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/articles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Edit Article</h1>
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
        submitLabel="Update Article"
        initialThumbnail={getInitialThumbnail()}
      />
    </div>
  );
}
