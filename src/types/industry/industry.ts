export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface IndustryFilters {
  search?: string;
}

export interface IndustryResponse {
  industry: Industry[];
  total: number;
  page: number;
  limit: number;
}
