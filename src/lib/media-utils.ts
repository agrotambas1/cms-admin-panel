import { cmsApi } from "./api";

export function getMediaUrl(url: string | null | undefined): string {
  if (!url)
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';

  const backendOrigin = cmsApi.defaults.baseURL!.replace(/\/api\/cms\/?$/, "");

  const normalizedUrl = url
    .replace(/^\/api\/uploads?\//, "/uploads/")
    .replace(/^\/uploads?\//, "/uploads/");

  return normalizedUrl.startsWith("http")
    ? normalizedUrl
    : `${backendOrigin}${normalizedUrl}`;
}

export function getThumbnailUrl(url: string | null | undefined): string {
  if (!url)
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';

  const fullUrl = getMediaUrl(url);
  return fullUrl;
}
