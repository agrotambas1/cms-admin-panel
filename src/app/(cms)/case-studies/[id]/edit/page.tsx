"use client";

import { useRouter } from "next/navigation";
import { useServices } from "@/hooks/service/use-service";
import { useIndustries } from "@/hooks/industry/use-industry";
import { CaseStudyForm } from "../../_components/case-study-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUpdateCaseStudy } from "@/hooks/case-study/use-case-study";
import { UpdateCaseStudyForm } from "@/validations/case-study/case-study-validation";
import { use } from "react";
import { MediaFile } from "@/types/media/media";
import { PermissionGuard } from "@/components/common/permission-guard";
import { canEdit } from "@/lib/permission";
import { SkeletonForm } from "@/components/common/skeleton-form";

export default function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: caseStudyId } = use(params);

  const {
    form,
    loading,
    initializing,
    isSlugTouched,
    setIsSlugTouched,
    handleTitleChange,
    resetSlug,
    updateCaseStudy,
    caseStudy,
  } = useUpdateCaseStudy(caseStudyId, () => {
    router.push("/case-studies");
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

  const onSubmit = async (data: UpdateCaseStudyForm) => {
    await updateCaseStudy(data);
  };

  const getInitialThumbnail = (): MediaFile | null => {
    if (!caseStudy?.thumbnailMedia) return null;

    return {
      id: caseStudy.thumbnailMedia.id,
      url: caseStudy.thumbnailMedia.url,
      title: caseStudy.thumbnailMedia.fileName,
      fileName: caseStudy.thumbnailMedia.fileName,
      altText: "",
      caption: "",
      description: "",
    };
  };

  const getInitialPublication = (): MediaFile | null => {
    if (!caseStudy?.publication) return null;

    return {
      id: caseStudy.publication.id,
      url: caseStudy.publication.url,
      title: caseStudy.publication.fileName,
      fileName: caseStudy.publication.fileName,
      altText: "",
      caption: "",
      description: "",
    };
  };

  if (initializing || servicesLoading || industriesLoading) {
    return <SkeletonForm />;
  }

  return (
    <PermissionGuard check={canEdit}>
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/case-studies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Edit Case Study</h1>
          </div>
        </div>

        <CaseStudyForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          isSlugTouched={isSlugTouched}
          setIsSlugTouched={setIsSlugTouched}
          handleTitleChange={handleTitleChange}
          resetSlug={resetSlug}
          services={services}
          industries={industries}
          submitLabel="Update Case Study"
          initialThumbnail={getInitialThumbnail()}
          initialPublication={getInitialPublication()}
        />
      </div>
    </PermissionGuard>
  );
}
