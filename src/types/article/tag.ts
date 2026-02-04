export interface Tag {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface TagFilters {
  search: string;
}

export interface TagsResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
}
