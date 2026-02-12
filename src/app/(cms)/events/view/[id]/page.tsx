"use client";

import { useParams, useRouter } from "next/navigation";
import { useEvent } from "@/hooks/event/use-event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { DeleteEventDialog } from "../../_components/delete-event-dialog";
import { getMediaUrl } from "@/lib/media-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { canDelete, canEdit } from "@/lib/permission";

export default function EventViewPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { event, loading, error } = useEvent(id);
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

  if (error || !event) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Event Not Found</h1>
        </div>
        <p className="text-muted-foreground">
          {error || "The event you're looking for doesn't exist."}
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
              <Link href={`/events/${event.id}/edit`}>
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
                  {event.eventName}
                </h1>

                <div className="flex items-center mt-2 gap-10 justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground uppercase">
                      Service
                    </span>
                    {event.service && (
                      <span className="text-md">{event.service.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground uppercase">
                      Industy
                    </span>
                    {event.industry && (
                      <span className="text-md">{event.industry.name}</span>
                    )}
                  </div>
                </div>
              </div>
              {event.thumbnailMedia && (
                <div className="max-w-200 space-y-2 mx-auto">
                  <div className="w-full rounded-lg border overflow-hidden">
                    <img
                      src={getMediaUrl(event.thumbnailMedia.url)}
                      alt={event.thumbnailMedia.altText || event.eventName}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {event.description && (
                <div className="space-y-2">
                  <div
                    className="prose prose-lg max-w-none insight-content"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Service</p>
                  <p className="text-sm text-muted-foreground">
                    {event.service?.name || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Industry</p>
                  <p className="text-sm text-muted-foreground">
                    {event.industry?.name || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Event Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.eventDate), "PPP p")}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Event Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {event.eventType}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Location Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {event.locationType}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {event.location || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Meeting Url</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {event.meetingUrl || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Registration Url</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {event.registrationUrl || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {event.status}
                  </p>
                </div>
                {event.updatedAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.updatedAt), "PPP p")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {deleteDialogOpen && (
        <DeleteEventDialog
          event={event}
          open={deleteDialogOpen}
          canDelete={canDelete(role)}
          onOpenChange={setDeleteDialogOpen}
          onDeleted={() => {
            router.push("/events");
          }}
        />
      )}
    </div>
  );
}
