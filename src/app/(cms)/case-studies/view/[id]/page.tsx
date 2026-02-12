"use client";

import { useParams, useRouter } from "next/navigation";
import { useCaseStudy } from "@/hooks/case-study/use-case-study";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { DeleteCaseStudyDialog } from "../../_components/delete-case-study-dialog";
import { getMediaUrl } from "@/lib/media-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PublicationDownload } from "@/components/common/download/publication-download";
import { canDelete, canEdit } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

export default function CaseStudyViewPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { caseStudy, loading, error } = useCaseStudy(id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (loading || authLoading) {
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

  if (error || !caseStudy) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Case Study Not Found</h1>
        </div>
        <p className="text-muted-foreground">
          {error || "The case study you're looking for doesn't exist."}
        </p>
      </div>
    );
  }

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
          {canEdit(role) && (
            <Button variant="outline" asChild>
              <Link href={`/case-studies/${caseStudy.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}

          {canDelete(role) && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-5 space-y-4">
          <div className="">
            <div className="rounded-lg border p-10 space-y-6">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-center">
                  {caseStudy.title}
                </h1>

                <div className="flex items-center mt-2 gap-10 justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground uppercase">
                      Service
                    </span>
                    {caseStudy.service && (
                      <span className="text-md">{caseStudy.service.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground uppercase">
                      Industy
                    </span>
                    {caseStudy.industry && (
                      <span className="text-md">{caseStudy.industry.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground uppercase">
                      Client
                    </span>
                    <span className="text-md">{caseStudy.client}</span>
                  </div>
                </div>
              </div>

              {caseStudy.thumbnailMedia && (
                <div className="max-w-200 space-y-2 mx-auto">
                  <div className="w-full rounded-lg border overflow-hidden">
                    <img
                      src={getMediaUrl(caseStudy.thumbnailMedia.url)}
                      alt={caseStudy.thumbnailMedia.altText || caseStudy.title}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {caseStudy.publication && (
                <PublicationDownload media={caseStudy.publication} />
              )}

              <h2 className="text-2xl font-bold">Overview</h2>

              {caseStudy.overview && (
                <div className="space-y-2">
                  <div
                    className="prose prose-lg max-w-none insight-content"
                    dangerouslySetInnerHTML={{ __html: caseStudy.overview }}
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold">Problem</h2>

              {caseStudy.problem && (
                <div className="space-y-2">
                  <div
                    className="prose prose-lg max-w-none insight-content"
                    dangerouslySetInnerHTML={{ __html: caseStudy.problem }}
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold">Solution</h2>
              {caseStudy.solution && (
                <div className="space-y-2">
                  <div
                    className="prose prose-lg max-w-none insight-content"
                    dangerouslySetInnerHTML={{ __html: caseStudy.solution }}
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold">Outcomes</h2>
              {caseStudy.outcomesDesc && (
                <div className="space-y-2">
                  <div
                    className="prose prose-lg max-w-none insight-content"
                    dangerouslySetInnerHTML={{ __html: caseStudy.outcomesDesc }}
                  />
                </div>
              )}

              {caseStudy.outcomes
                ?.filter((o) => o.metric || o.value)
                .map((o, i) => (
                  <div key={i}>
                    {o.metric && <p>{o.metric}</p>}
                    {o.value && <p>{o.value}</p>}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">SEO Information</h2>
            </CardHeader>
            <CardContent>
              {(caseStudy.metaTitle ||
                caseStudy.metaDescription ||
                (caseStudy.seoKeywords &&
                  caseStudy.seoKeywords.length > 0)) && (
                <div className="space-y-4 pt-4 border-t">
                  {caseStudy.metaTitle && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Meta Title</p>
                      <p className="text-sm text-muted-foreground">
                        {caseStudy.metaTitle}
                      </p>
                    </div>
                  )}

                  {caseStudy.metaDescription && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Meta Description</p>
                      <p className="text-sm text-muted-foreground">
                        {caseStudy.metaDescription}
                      </p>
                    </div>
                  )}

                  {caseStudy.seoKeywords &&
                    caseStudy.seoKeywords.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">SEO Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {caseStudy.seoKeywords.map(
                            (keyword: string | { keyword: string }, index) => (
                              <Badge key={index} variant="secondary">
                                {typeof keyword === "string"
                                  ? keyword
                                  : keyword.keyword}
                              </Badge>
                            ),
                          )}
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
                  <p className="text-sm font-medium">Service</p>
                  <p className="text-sm text-muted-foreground">
                    {caseStudy.service?.name || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Industry</p>
                  <p className="text-sm text-muted-foreground">
                    {caseStudy.industry?.name || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {caseStudy.status}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Published At
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {caseStudy.publishedAt
                      ? format(new Date(caseStudy.publishedAt), "PPP p")
                      : "Not published"}
                  </p>
                </div>

                {caseStudy.updatedAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(caseStudy.updatedAt), "PPP p")}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm font-medium">Featured Case Study</p>
                  <p className="text-sm text-muted-foreground">
                    {caseStudy.isFeatured ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {deleteDialogOpen && (
        <DeleteCaseStudyDialog
          caseStudy={caseStudy}
          open={deleteDialogOpen}
          canDelete={canDelete(role)}
          onOpenChange={setDeleteDialogOpen}
          onDeleted={() => {
            router.push("/case-studies");
          }}
        />
      )}
    </div>
  );
}
