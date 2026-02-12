export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailId: string | null;
  publicationId: string | null;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[] | null;
  status: string;
  publishedAt: string | null;
  scheduledAt: string | null;
  viewCount: number;
  isFeatured: boolean;
  createdBy: string;
  updatedBy: string | null;
  categoryId: string;
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
    mimeType?: string;
  };

  category?: {
    id: string;
    name: string;
    slug: string;
  };

  creator?: {
    id: string;
    name: string;
  };

  tags?: Array<{
    id: string;
    name: string;
  }>;

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

export interface ArticleFilters {
  search?: string;
  status?: string;
  categoryId?: string;
  isFeatured?: boolean;
  serviceId?: string;
  industryId?: string;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
