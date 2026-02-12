export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface ServiceFilters {
  search?: string;
}

export interface ServiceResponse {
  service: Service[];
  total: number;
  page: number;
  limit: number;
}
