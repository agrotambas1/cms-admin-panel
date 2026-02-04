export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserFilters {
  search: string;
  role: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
