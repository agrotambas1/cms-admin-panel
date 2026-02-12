"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "../_components/event-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCreateEvent } from "@/hooks/event/use-event";
import { CreateEventForm } from "@/validations/event/event-validation";
import { useServices } from "@/hooks/service/use-service";
import { useIndustries } from "@/hooks/industry/use-industry";
import { PermissionGuard } from "@/components/common/permission-guard";
import { canCreate } from "@/lib/permission";
import { SkeletonForm } from "@/components/common/skeleton-form";

export default function CreateEventPage() {
  const router = useRouter();

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleEventNameChange,
    resetSlug,
    createEvent,
  } = useCreateEvent(() => {
    router.push("/events");
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

  const onSubmit = async (data: CreateEventForm) => {
    await createEvent(data);
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
            <h1 className="text-xl font-bold">Create New Event</h1>
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
          submitLabel="Create Event"
          initialThumbnail={null}
        />
      </div>
    </PermissionGuard>
  );
}
