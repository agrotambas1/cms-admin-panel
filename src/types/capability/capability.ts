export interface Capability {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface CapabilityFilters {
  search?: string;
}

export interface CapabilityResponse {
  capability: Capability[];
  total: number;
  page: number;
  limit: number;
}
