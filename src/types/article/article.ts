export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailId: string | null;
  publicationId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
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

  thumbnailMedia?: {
    id: string;
    url: string;
    fileName: string;
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

  seoKeywords?: Array<{
    id: string;
    keyword: string;
    order: number;
  }>;
}

export interface ArticleFilters {
  search?: string;
  status?: string;
  categoryId?: string;
  isFeatured?: boolean;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
