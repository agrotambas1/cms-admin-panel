import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import { Event, EventFilters } from "@/types/event/event";
import {
  CreateEventForm,
  CreateEventSchema,
  UpdateEventForm,
  UpdateEventSchema,
} from "@/validations/event/event-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface UseEventsParams extends EventFilters {
  page: number;
  limit: number;
  serviceId?: string;
  industryId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useEvents({
  search,
  page,
  limit,
  serviceId,
  industryId,
  sortBy = "createdAt",
  order = "desc",
}: UseEventsParams) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await cmsApi.get("/events", {
        params: {
          search,
          page,
          limit,
          serviceId,
          industryId,
          sortBy,
          order,
        },
      });

      setEvents(data.data || data.events || data);
      setPagination({
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      });

      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, serviceId, industryId, sortBy, order]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = () => fetchEvents();

  return { events, loading, error, pagination, refetch };
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await cmsApi.get(`/events/${id}`);
        setEvent(data.data || data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return { event, loading, error };
}

export function useCreateEvent(onSucces?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      eventName: "",
      slug: "",
      excerpt: "",
      description: "",
      thumbnailId: null,
      eventType: "webinar",
      eventDate: "",
      location: null,
      locationType: "online",
      meetingUrl: null,
      registrationUrl: null,
      quota: null,
      status: "draft",
      serviceId: null,
      industryId: null,
    },
  }) as UseFormReturn<CreateEventForm>;

  const handleEventNameChange = (value: string) => {
    form.setValue("eventName", value, { shouldValidate: true });

    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(value), {
        shouldValidate: true,
      });
    }
  };

  const resetSlug = () => {
    setIsSlugTouched(false);
    form.setValue("slug", generateSlug(form.getValues("eventName")), {
      shouldValidate: true,
    });
  };

  const createEvent = async (data: CreateEventForm) => {
    setLoading(true);

    try {
      await cmsApi.post("/events", data);

      toast.success(`Event ${data.eventName} created successfully`);

      form.reset();
      setIsSlugTouched(false);
      onSucces?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleEventNameChange,
    resetSlug,
    createEvent,
  };
}

export function useUpdateEvent(id: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const form = useForm({
    resolver: zodResolver(UpdateEventSchema),
    defaultValues: {
      eventName: "",
      slug: "",
      excerpt: "",
      description: "",
      thumbnailId: "",
      eventType: "webinar",
      eventDate: "",
      location: "",
      locationType: "online",
      meetingUrl: "",
      registrationUrl: "",
      quota: 0,
      status: "draft",
      serviceId: "",
      industryId: "",
    },
  }) as UseFormReturn<UpdateEventForm>;

  const { event, loading: eventLoading } = useEvent(id);

  useEffect(() => {
    if (event && !eventLoading) {
      form.reset({
        eventName: event.eventName,
        slug: event.slug,
        excerpt: event.excerpt,
        description: event.description || "",
        thumbnailId: event.thumbnailId,
        eventType: event.eventType as "webinar" | "conference" | "roundtable",
        eventDate: event.eventDate,
        location: event.location,
        locationType: event.locationType as "online" | "offline" | "hybrid",
        meetingUrl: event.meetingUrl,
        registrationUrl: event.registrationUrl,
        quota: event.quota,
        status: event.status as "draft" | "published" | "archived",
        serviceId: event.serviceId,
        industryId: event.industryId,
      });
      setIsSlugTouched(true);
      setInitializing(false);
    }
  }, [event, eventLoading, form]);

  const locationType = form.watch("locationType");

  useEffect(() => {
    if (locationType === "online") {
      form.setValue("location", null);
    } else if (locationType === "offline") {
      form.setValue("meetingUrl", null);
    }
  }, [locationType, form]);

  const handleEventNameChange = (value: string) => {
    form.setValue("eventName", value, { shouldValidate: true });

    if (!isSlugTouched) {
      form.setValue("slug", generateSlug(value), {
        shouldValidate: true,
      });
    }
  };

  const resetSlug = () => {
    setIsSlugTouched(false);
    form.setValue("slug", generateSlug(form.getValues("eventName")), {
      shouldValidate: true,
    });
  };

  const updateEvent = async (data: UpdateEventForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/events/${id}`, data);

      toast.success(`Event ${data.eventName} updated successfully`);

      onSuccess?.();

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error("Slug already exists. Please use a different name.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to update event",
          );
        }
      } else {
        toast.error("Failed to update event");
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleEventNameChange,
    resetSlug,
    updateEvent,
    initializing: initializing || eventLoading,
    event,
  };
}

interface DeleteEventParams {
  eventId: string;
  eventName: string;
  canDelete: boolean;
  onSuccess?: () => void;
}

export function useDeleteEvent({
  eventId,
  eventName,
  canDelete,
  onSuccess,
}: DeleteEventParams) {
  const [loading, setLoading] = useState(false);

  const deleteEvent = async () => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this event");
      return { success: false };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/events/${eventId}`);

      toast.success(`Event ${eventName} deleted successfully`);
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteEvent,
  };
}

interface BulkDeleteEventsParams {
  onSuccess?: () => void;
}

export function useBulkDeleteEvents({ onSuccess }: BulkDeleteEventsParams) {
  const [loading, setLoading] = useState(false);

  const bulkDeleteEvents = async (eventIds: Set<string | number>) => {
    if (eventIds.size === 0) {
      toast.error("No event selected");
      return { success: false };
    }

    setLoading(true);
    try {
      const deletePromises = Array.from(eventIds).map((id) =>
        cmsApi.delete(`/events/${id}`),
      );

      await Promise.all(deletePromises);

      toast.success(
        `Successfully deleted ${eventIds.size} event${eventIds.size > 1 ? "s" : ""}`,
      );
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error("Error deleting events:", error);
      toast.error("Failed to delete events");

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bulkDeleteEvents,
  };
}
