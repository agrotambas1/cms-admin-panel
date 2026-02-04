"use client";

import { useRouter } from "next/navigation";

import { useCategories } from "@/hooks/articles/use-category";
import { ArticleForm } from "../_components/article-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCreateArticle } from "@/hooks/articles/use-article";
import { useTags } from "@/hooks/articles/use-tag";
import { CreateArticleForm } from "@/validations/article/article-validation";

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

  const onSubmit = async (data: CreateArticleForm) => {
    await createArticle(data);
  };

  if (categoriesLoading || tagsLoading) {
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
          <h1 className="text-xl font-bold">Create New Article</h1>
          {/* <p className="text-muted-foreground">
            Add a new article to your blog
          </p> */}
        </div>
      </div>

      {/* <Card>
        <CardContent></CardContent>
      </Card> */}
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
        submitLabel="Create Article"
        initialThumbnail={null}
      />
    </div>
  );
}
