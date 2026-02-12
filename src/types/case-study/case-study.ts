export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  overview: string;
  problem: string;
  solution: string;
  outcomesDesc: string;
  outcomes: CaseStudyOutcome[];
  client: string;
  thumbnailId: string | null;
  publicationId: string | null;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[] | null;
  status: string;
  publishedAt: string | null;
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

  publication?: {
    id: string;
    url: string;
    fileName: string;
    altText?: string | null;
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

export interface CaseStudyOutcome {
  metric: string;
  value: string;
  // description?: string | null;
}

export interface CaseStudyFilters {
  search?: string;
  status?: string;
  client?: string;
  isFeatured?: boolean;
  serviceId?: string;
  industryId?: string;
}

export interface CaseStudiesResponse {
  data: CaseStudy[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
