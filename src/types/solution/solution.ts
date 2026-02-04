export interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface SolutionFilters {
  search?: string;
}

export interface SolutionResponse {
  solutions: Solution[];
  total: number;
  page: number;
  limit: number;
}
