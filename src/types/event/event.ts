export interface Event {
  id: string;
  eventName: string;
  slug: string;
  excerpt: string | null;
  description: string | null;
  thumbnailId: string | null;
  eventType: string | null;
  eventDate: string;
  location: string | null;
  locationType: string;
  meetingUrl: string | null;
  registrationUrl: string | null;
  quota: number | null;
  status: string;
  isFeatured: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  serviceId: string;
  industryId: string;

  thumbnailMedia?: {
    id: string;
    url: string;
    fileName: string;
    altText?: string | null;
    caption?: string | null;
  };

  creator?: {
    id: string;
    name: string;
  };

  updater?: {
    id: string;
    name: string;
  };

  service?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };

  industry?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
}

export interface EventFilters {
  search?: string;
  status?: string;
  eventType?: string;
  locationType?: string;
  serviceId?: string;
  industryId?: string;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
