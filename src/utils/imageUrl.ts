/**
 * Normalizes image URLs from the backend to ensure they can be loaded correctly.
 * Handles relative paths, absolute URLs, and different URL formats.
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  // If it's already a full URL (http/https), return as is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // If it's a data URL, return as is
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // If it starts with //, it's a protocol-relative URL, add https:
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Get API base URL from environment or default
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  
  // For relative paths starting with /, prepend API base URL
  if (trimmed.startsWith("/")) {
    // If path already starts with /api, use as is (but ensure it's a full path)
    if (trimmed.startsWith("/api/")) {
      // In development, proxy handles /api, so return as is
      // In production, might need full backend URL
      return trimmed;
    }
    // For other absolute paths starting with /, prepend API base
    return `${apiBaseUrl}${trimmed}`;
  }

  // For paths without leading slash, assume they're relative to API base
  // Ensure proper formatting
  return `${apiBaseUrl}/${trimmed}`;
}

/**
 * Extracts and normalizes the first image URL from a photos field.
 * Handles arrays, JSON strings, and plain strings.
 */
export function getFirstImageUrl(photos: string | string[] | null | undefined): string | null {
  if (!photos) {
    console.log("[getFirstImageUrl] No photos provided");
    return null;
  }

  console.log("[getFirstImageUrl] Input photos:", photos, "Type:", typeof photos, "IsArray:", Array.isArray(photos));

  let urlList: string[] = [];

  if (Array.isArray(photos)) {
    urlList = photos.filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    );
    console.log("[getFirstImageUrl] Extracted from array:", urlList);
  } else if (typeof photos === "string" && photos.trim() !== "") {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(photos) as unknown;
      console.log("[getFirstImageUrl] Parsed JSON:", parsed, "IsArray:", Array.isArray(parsed));
      if (Array.isArray(parsed)) {
        urlList = parsed.filter(
          (item): item is string => typeof item === "string" && item.trim() !== ""
        );
      } else if (typeof parsed === "string") {
        urlList = [parsed];
      }
    } catch (e) {
      // Not JSON, treat as plain string
      console.log("[getFirstImageUrl] Not JSON, treating as plain string");
      urlList = [photos];
    }
  }

  // Get the first valid URL and normalize it
  const firstUrl = urlList.find((url) => url && url.trim() !== "");
  console.log("[getFirstImageUrl] First URL found:", firstUrl);
  
  if (firstUrl) {
    const normalized = normalizeImageUrl(firstUrl);
    console.log("[getFirstImageUrl] Normalized URL:", normalized);
    return normalized;
  }
  
  console.log("[getFirstImageUrl] No valid URL found");
  return null;
}

/**
 * Extracts and normalizes all image URLs from a photos field.
 */
export function getAllImageUrls(photos: string | string[] | null | undefined): string[] {
  if (!photos) {
    return [];
  }

  let urlList: string[] = [];

  if (Array.isArray(photos)) {
    urlList = photos.filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    );
  } else if (typeof photos === "string" && photos.trim() !== "") {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(photos) as unknown;
      if (Array.isArray(parsed)) {
        urlList = parsed.filter(
          (item): item is string => typeof item === "string" && item.trim() !== ""
        );
      } else if (typeof parsed === "string") {
        urlList = [parsed];
      }
    } catch {
      // Not JSON, treat as plain string (could be comma-separated)
      urlList = photos.split(/[,|]/).map((item) => item.trim()).filter((item) => item !== "");
    }
  }

  // Normalize all URLs and filter out nulls
  return urlList
    .map((url) => normalizeImageUrl(url))
    .filter((url): url is string => url !== null);
}

