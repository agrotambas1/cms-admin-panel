"use client";

import { useParams, useRouter } from "next/navigation";
import { useArticle } from "@/hooks/articles/use-article";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Eye, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { DeleteArticleDialog } from "../../_components/delete-article-dialog";
import { getMediaUrl } from "@/lib/media-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PublicationDownload } from "../../_components/publication-download";

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { article, loading, error } = useArticle(id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Article Not Found</h1>
        </div>
        <p className="text-muted-foreground">
          {error || "The article you're looking for doesn't exist."}
        </p>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-gray-500",
    published: "bg-green-500",
    scheduled: "bg-blue-500",
  };

  return (
    <div className="w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Article Details</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/articles/${article.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-5 space-y-4">
          <div className="">
            <div className="rounded-lg border p-10 space-y-6">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-center">
                  {article.title}
                </h1>

                <div className="flex items-center gap-10 justify-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarFallback className="rounded-full">
                        {article.creator?.name?.charAt(0) ?? "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <h4 className="text-md truncate font-medium">
                        {article.creator?.name ?? "Anonymous"}
                      </h4>
                    </div>
                  </div>
                  <div>
                    <span className="text-md text-muted-foreground truncate">
                      {article.publishedAt
                        ? format(new Date(article.publishedAt), "PPP")
                        : "Not published"}
                    </span>
                  </div>
                  <div>
                    {article.category && (
                      <span className="text-md">{article.category.name}</span>
                    )}
                  </div>
                </div>
              </div>

              {article.thumbnailMedia && (
                <div className="max-w-200 space-y-2 mx-auto">
                  <div className="w-full rounded-lg border overflow-hidden">
                    <img
                      src={getMediaUrl(article.thumbnailMedia.url)}
                      alt={article.title}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {article.publication && (
                <PublicationDownload media={article.publication} />
              )}

              {article.content && (
                <div className="space-y-2">
                  <div
                    className="prose prose-lg max-w-none article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">SEO Information</h2>
            </CardHeader>
            <CardContent>
              {(article.metaTitle ||
                article.metaDescription ||
                (article.seoKeywords && article.seoKeywords.length > 0)) && (
                <div className="space-y-4 pt-4 border-t">
                  {article.metaTitle && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Meta Title</p>
                      <p className="text-sm text-muted-foreground">
                        {article.metaTitle}
                      </p>
                    </div>
                  )}

                  {article.metaDescription && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Meta Description</p>
                      <p className="text-sm text-muted-foreground">
                        {article.metaDescription}
                      </p>
                    </div>
                  )}

                  {article.seoKeywords && article.seoKeywords.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">SEO Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {article.seoKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {typeof keyword === "string"
                              ? keyword
                              : keyword.keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">
                    {article.category?.name || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {article.status}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Published At
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {article.publishedAt
                      ? format(new Date(article.publishedAt), "PPP p")
                      : "Not published"}
                  </p>
                </div>

                {article.scheduledAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Scheduled At
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(article.scheduledAt), "PPP p")}
                    </p>
                  </div>
                )}

                {article.updatedAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(article.updatedAt), "PPP p")}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Count
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {article.viewCount.toLocaleString()} views
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Featured Article</p>
                  <p className="text-sm text-muted-foreground">
                    {article.isFeatured ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge
                        key={typeof tag === "string" ? tag : tag.id}
                        variant="outline"
                      >
                        {typeof tag === "string" ? tag : tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {deleteDialogOpen && (
        <DeleteArticleDialog
          article={article}
          open={deleteDialogOpen}
          canDelete={true}
          onOpenChange={setDeleteDialogOpen}
          onDeleted={() => {
            router.push("/articles");
          }}
        />
      )}
    </div>
  );
}
