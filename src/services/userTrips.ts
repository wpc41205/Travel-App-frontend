import type { AxiosResponse } from "axios";
import { api } from "../api";

type Nullable<T> = T | null | undefined;

export type UserTrip = {
  id: string;
  ownerId?: Nullable<string | number>;
  title?: Nullable<string>;
  province?: Nullable<string>;
  location?: Nullable<string>;
  description?: Nullable<string>;
  photos?: Nullable<string | string[]>;
  latitude?: Nullable<string | number>;
  longitude?: Nullable<string | number>;
  tags?: Nullable<string | string[]>;
  updatedAt?: Nullable<string | number | Date>;
  createdAt?: Nullable<string | number | Date>;
  [key: string]: unknown;
};

export type UserTripInput = {
  title: string;
  province: string;
  description?: string;
  image?: string;
  photos?: string[];
  latitude?: string;
  longitude?: string;
  tags?: string[];
  authorId?: number;
};

type ApiListResponse<T> = AxiosResponse<T>;

const toPayload = (input: UserTripInput, authorId?: number) => {
  // Collect photos from both image (single) and photos (array) fields
  const photosArray: string[] = [];
  if (input.image?.trim()) {
    photosArray.push(input.image.trim());
  }
  if (input.photos && Array.isArray(input.photos)) {
    input.photos.forEach(photo => {
      const trimmed = photo?.trim();
      if (trimmed && !photosArray.includes(trimmed)) {
        photosArray.push(trimmed);
      }
    });
  }

  // Convert latitude and longitude to numbers
  const latitude = input.latitude?.trim() 
    ? parseFloat(input.latitude.trim()) 
    : undefined;
  const longitude = input.longitude?.trim() 
    ? parseFloat(input.longitude.trim()) 
    : undefined;

  // Build payload matching the expected format
  const payload: {
    title: string;
    description?: string;
    photos?: string[];
    tags?: string[];
    latitude?: number;
    longitude?: number;
    authorId?: number;
  } = {
    title: input.title.trim(),
  };

  if (input.description?.trim()) {
    payload.description = input.description.trim();
  }

  if (photosArray.length > 0) {
    payload.photos = photosArray;
  }

  if (input.tags && Array.isArray(input.tags) && input.tags.length > 0) {
    payload.tags = input.tags.filter(tag => tag?.trim()).map(tag => tag.trim());
  }

  if (latitude !== undefined && !isNaN(latitude)) {
    payload.latitude = latitude;
  }

  if (longitude !== undefined && !isNaN(longitude)) {
    payload.longitude = longitude;
  }

  // Include authorId if provided
  if (authorId !== undefined) {
    payload.authorId = authorId;
  } else if (input.authorId !== undefined) {
    payload.authorId = input.authorId;
  }

  return payload;
};

// Helper function to extract authorId from token
const extractAuthorIdFromToken = (token: string | null): number | null => {
  if (!token || token === "__authenticated__") {
    console.warn("No valid token provided");
    return null;
  }
  
  try {
    // Try to decode JWT token (if it's a JWT)
    const parts = token.split(".");
    if (parts.length === 3 && parts[1]) {
      const decoded = atob(parts[1]);
      if (decoded) {
        const payload = JSON.parse(decoded);
        
        // Try multiple possible field names
        const authorId = payload.userId || 
                        payload.id || 
                        payload.user_id || 
                        payload.authorId ||
                        payload.sub || // JWT standard 'subject' field
                        payload.user?.id ||
                        payload.userId;
        
        if (authorId) {
          const numId = Number(authorId);
          if (!isNaN(numId)) {
            return numId;
          } else {
            console.warn("authorId is not a number:", authorId);
          }
        } else {
          console.warn("No authorId found in token payload. Available fields:", Object.keys(payload));
        }
      }
    } else {
      console.warn("Token is not a valid JWT format");
    }
  } catch (e) {
    console.error("Error decoding token:", e);
    // Not a JWT or can't decode, try to parse as number directly
    const numId = Number(token);
    if (!isNaN(numId)) {
      return numId;
    }
  }
  
  return null;
};

// Helper function to extract email from token
const extractEmailFromToken = (token: string | null): string | null => {
  if (!token || token === "__authenticated__") return null;
  
  try {
    const parts = token.split(".");
    if (parts.length === 3 && parts[1]) {
      const decoded = atob(parts[1]);
      if (decoded) {
        const payload = JSON.parse(decoded);
        // JWT standard 'subject' field usually contains email or user identifier
        return payload.sub || payload.email || null;
      }
    }
  } catch (e) {
    console.error("Error extracting email from token:", e);
  }
  
  return null;
};

// Helper function to get user info from backend using token
// This function queries user ID from users table using email from token
async function getUserInfoFromToken(token: string | null): Promise<{ id?: number; userId?: number; authorId?: number } | null> {
  // Extract email from token first
  const email = extractEmailFromToken(token);
  if (!email) {
    console.warn("Cannot extract email from token");
    return null;
  }
  
  // Try multiple endpoints to get user by email
  // Priority: endpoints that query by email
  const endpointsToTry = [
    `/users/email/${encodeURIComponent(email)}`,  // GET /users/email/{email}
    `/users?email=${encodeURIComponent(email)}`,  // GET /users?email={email}
    "/users/me",                                   // GET /users/me (uses token)
    "/auth/me",                                    // GET /auth/me
    "/user/me",                                    // GET /user/me
  ];
  
  for (const endpoint of endpointsToTry) {
    try {
      const response = await api.get(endpoint);
      const userInfo = response.data;
      
      // Try to extract user ID from response
      // The ID should be from the users table (id column)
      let userId: number | undefined;
      
      // Case 1: Direct object with id
      if (userInfo && typeof userInfo === 'object' && !Array.isArray(userInfo)) {
        userId = userInfo.id || userInfo.userId || userInfo.authorId;
      }
      
      // Case 2: Nested in data property
      if (!userId && userInfo?.data) {
        userId = userInfo.data.id || userInfo.data.userId || userInfo.data.authorId;
      }
      
      // Case 3: Array response (get first item)
      if (!userId && Array.isArray(userInfo) && userInfo.length > 0) {
        const firstUser = userInfo[0];
        userId = firstUser?.id || firstUser?.userId || firstUser?.authorId;
      }
      
      if (userId) {
        const user = { 
          id: Number(userId), 
          userId: Number(userId), 
          authorId: Number(userId) 
        };
        return user;
      } else {
        console.warn(`No user ID found in response from ${endpoint}`);
      }
    } catch (error: any) {
      console.warn(`❌ Failed to get user info from ${endpoint}:`, error.response?.status, error.response?.statusText);
      // Continue to next endpoint
    }
  }
  
  console.error("⚠️ Could not get user info from any endpoint");
  return null;
}

export async function getUserTrips(ownerId: string | null): Promise<UserTrip[]> {
  if (!ownerId) {
    console.warn("No ownerId provided");
    return [];
  }

  // Extract authorId from token (may not work if token only has email)
  let authorId = extractAuthorIdFromToken(ownerId);

  // Always try to get user ID from backend using email from token
  // This ensures we get the correct user ID from users table
  if (authorId === null) {
    const userInfo = await getUserInfoFromToken(ownerId);
    if (userInfo) {
      authorId = (userInfo.id ?? userInfo.userId ?? userInfo.authorId) || null;
    } else {
      console.warn("⚠️ Could not get user info from backend");
    }
  } else {
    // Even if we have authorId from token, verify it's correct by querying backend
    const userInfo = await getUserInfoFromToken(ownerId);
    if (userInfo) {
      const backendUserId = userInfo.id ?? userInfo.userId ?? userInfo.authorId;
      if (backendUserId && backendUserId !== authorId) {
        console.warn(`⚠️ Token authorId (${authorId}) doesn't match backend user ID (${backendUserId}), using backend ID`);
        authorId = backendUserId;
      }
    }
  }

  // If we still don't have authorId, return empty array (don't fetch all trips)
  if (authorId === null) {
    console.warn("⚠️ Cannot determine authorId, returning empty array for security");
    console.warn("This prevents fetching all trips. Please check token payload or backend user endpoint.");
    return [];
  }

  // Use /trips/author/{authorId} endpoint - this is the correct endpoint
  const endpoint = `/trips/author/${authorId}`;
  
  try {
    const response: ApiListResponse<UserTrip[]> = await api.get(endpoint);
    
    let trips = Array.isArray(response.data) ? response.data : [];
    
    // Double-check: filter by authorId to ensure security
    if (trips.length > 0) {
      trips = trips.filter(trip => {
        const tripAuthorId = trip.ownerId || (trip as any).authorId;
        const matches = tripAuthorId === authorId || Number(tripAuthorId) === authorId;
        if (!matches) {
          console.warn(`Trip ${trip.id} has authorId ${tripAuthorId}, expected ${authorId}`);
        }
        return matches;
      });
    }
    
    return trips;
  } catch (error: any) {
    console.error("❌ Failed to fetch user trips", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Error message:", error.message);
    throw error;
  }
}

export async function createUserTrip(ownerId: string | null, input: UserTripInput, authorId?: number): Promise<UserTrip> {
  // For creating trips, use /trips endpoint and include authorId in payload
  // Don't use /users/me/trips as it may not be supported for POST
  let finalAuthorId = authorId;
  
  // If authorId not provided, try to extract from token
  if (!finalAuthorId && ownerId) {
    const extractedId = extractAuthorIdFromToken(ownerId);
    finalAuthorId = extractedId !== null ? extractedId : undefined;
    
    // If still no authorId, try to get from backend
    if (!finalAuthorId) {
      const userInfo = await getUserInfoFromToken(ownerId);
      if (userInfo) {
        const userId = userInfo.id ?? userInfo.userId ?? userInfo.authorId;
        finalAuthorId = userId ? Number(userId) : undefined;
      }
    }
  }
  
  if (!finalAuthorId) {
    throw new Error("Cannot determine authorId. Please ensure you are logged in.");
  }
  
  try {
    // Use /trips endpoint for POST (not /users/me/trips)
    const endpoint = "/trips";
    const payload = toPayload(input, finalAuthorId);
    
    const response = await api.post<UserTrip>(endpoint, payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create user trip", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw error;
  }
}

export async function updateUserTrip(
  ownerId: string | null,
  tripId: string | number,
  input: UserTripInput,
  authorId?: number,
): Promise<UserTrip> {
  // For updating trips, use /trips/{tripId} endpoint
  let finalAuthorId = authorId;
  
  // If authorId not provided, try to extract from token
  if (!finalAuthorId && ownerId) {
    const extractedId = extractAuthorIdFromToken(ownerId);
    finalAuthorId = extractedId !== null ? extractedId : undefined;
    
    // If still no authorId, try to get from backend
    if (!finalAuthorId) {
      const userInfo = await getUserInfoFromToken(ownerId);
      if (userInfo) {
        const userId = userInfo.id ?? userInfo.userId ?? userInfo.authorId;
        finalAuthorId = userId ? Number(userId) : undefined;
      }
    }
  }
  
  try {
    // Use /trips/{tripId} endpoint for PUT
    const endpoint = `/trips/${tripId}`;
    const payload = toPayload(input, finalAuthorId);
    
    const response = await api.put<UserTrip>(endpoint, payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update user trip", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw error;
  }
}

export async function deleteUserTrip(_ownerId: string | null, tripId: string | number): Promise<void> {
  try {
    // Use /trips/{tripId} endpoint for DELETE
    const endpoint = `/trips/${tripId}`;
    
    await api.delete(endpoint);
  } catch (error: any) {
    console.error("Failed to delete user trip", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw error;
  }
}


