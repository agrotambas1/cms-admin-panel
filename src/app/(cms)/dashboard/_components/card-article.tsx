"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseStudies } from "@/hooks/case-study/use-case-study";
import { ArrowRight, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/articles/use-article";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CardArticle() {
  const { article, loading, pagination } = useArticles({
    page: 1,
    limit: 1000,
  });

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Articles</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalArticles = pagination?.total || article.length;
  const publishedCount = article.filter(
    (cs) => cs.status === "published",
  ).length;
  const draftCount = article.filter((cs) => cs.status === "draft").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Articles</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalArticles}</div>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          {publishedCount} published · {draftCount} draft
        </p>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/articles">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
