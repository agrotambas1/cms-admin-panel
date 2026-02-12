"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "../../_components/event-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUpdateEvent } from "@/hooks/event/use-event";
import { UpdateEventForm } from "@/validations/event/event-validation";
import { use } from "react";
import { MediaFile } from "@/types/media/media";
import { useServices } from "@/hooks/service/use-service";
import { useIndustries } from "@/hooks/industry/use-industry";
import { PermissionGuard } from "@/components/common/permission-guard";
import { canEdit } from "@/lib/permission";
import { SkeletonForm } from "@/components/common/skeleton-form";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: eventId } = use(params);

  const {
    form,
    loading,
    initializing,
    isSlugTouched,
    setIsSlugTouched,
    handleEventNameChange,
    resetSlug,
    updateEvent,
    event,
  } = useUpdateEvent(eventId, () => router.push("/events"));

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

  const onSubmit = async (data: UpdateEventForm) => {
    await updateEvent(data);
  };

  const getInitialThumbnail = (): MediaFile | null => {
    if (!event?.thumbnailMedia) return null;

    return {
      id: event.thumbnailMedia.id,
      url: event.thumbnailMedia.url,
      title: event.thumbnailMedia.fileName,
      fileName: event.thumbnailMedia.fileName,
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
            <Link href="/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Edit Event</h1>
          </div>
        </div>

        <EventForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          isSlugTouched={isSlugTouched}
          setIsSlugTouched={setIsSlugTouched}
          handleEventNameChange={handleEventNameChange}
          resetSlug={resetSlug}
          services={services}
          industries={industries}
          submitLabel="Update Case Study"
          initialThumbnail={getInitialThumbnail()}
        />
      </div>
    </PermissionGuard>
  );
}
