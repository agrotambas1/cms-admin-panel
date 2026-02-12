"use client";

import { useRouter } from "next/navigation";
import { CaseStudyForm } from "../_components/case-study-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useServices } from "@/hooks/service/use-service";
import { useIndustries } from "@/hooks/industry/use-industry";
import { CreateCaseStudyForm } from "@/validations/case-study/case-study-validation";
import { useCreateCaseStudy } from "@/hooks/case-study/use-case-study";
import { PermissionGuard } from "@/components/common/permission-guard";
import { canCreate } from "@/lib/permission";
import { SkeletonForm } from "@/components/common/skeleton-form";

export default function CreateCaseStudyPage() {
  const router = useRouter();

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleTitleChange,
    resetSlug,
    createCaseStudy,
  } = useCreateCaseStudy(() => {
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

  const onSubmit = async (data: CreateCaseStudyForm) => {
    await createCaseStudy(data);
  };

  if (servicesLoading || industriesLoading) {
    return <SkeletonForm />;
  }

  return (
    <PermissionGuard check={canCreate}>
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/case-studies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Create New Case Study</h1>
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
          submitLabel="Create Case Study"
          initialThumbnail={null}
          initialPublication={null}
        />
      </div>
    </PermissionGuard>
  );
}
