export type MediaFile = {
  id: string;
  title: string;
  description: string;
  fileName: string;
  url: string;
  mimeType?: string;
  fileSize?: number;
  altText: string;
  caption: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface MediaFileFilters {
  search: string;
  type: string;
}

export interface MediaResponse {
  data: MediaFile[];
  total: number;
  page: number;
  limit: number;
}
