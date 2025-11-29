import axios from "axios";

type Nullable<T> = T | null | undefined;

export type Trip = {
  id?: Nullable<string | number>;
  title?: Nullable<string>;
  category?: Nullable<string>;
  subtitle?: Nullable<string>;
  description?: Nullable<string>;
  photos?: Nullable<string | string[]>;
  latitude?: Nullable<number | string>;
  longitude?: Nullable<number | string>;
  price?: Nullable<number | string>;
  duration?: Nullable<string>;
  location?: Nullable<string>;
  tags?: Nullable<string | string[]>;
  topics?: Nullable<string | string[]>;
  keywords?: Nullable<string | string[]>;
  link?: Nullable<string>;
  url?: Nullable<string>;
  [key: string]: unknown;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Add request interceptor to include authorization token
const AUTH_KEY = "authToken";
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (token && token !== "__authenticated__") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTrips = async (): Promise<Trip[]> => {
  try {
    // Try /trips endpoint first
    const response = await api.get<Trip[]>("/trips");
    const trips = Array.isArray(response.data) ? response.data : [];
    
    // Sort trips by most recent first
    // Try to sort by createdAt, updatedAt, or id (if it's a timestamp)
    trips.sort((a, b) => {
      // Try createdAt first
      const aCreated = (a as any).createdAt || (a as any).created_at;
      const bCreated = (b as any).createdAt || (b as any).created_at;
      if (aCreated && bCreated) {
        return new Date(bCreated).getTime() - new Date(aCreated).getTime();
      }
      
      // Try updatedAt
      const aUpdated = (a as any).updatedAt || (a as any).updated_at;
      const bUpdated = (b as any).updatedAt || (b as any).updated_at;
      if (aUpdated && bUpdated) {
        return new Date(bUpdated).getTime() - new Date(aUpdated).getTime();
      }
      
      // Fallback: sort by id (assuming higher id = newer)
      const aId = typeof a.id === 'number' ? a.id : typeof a.id === 'string' ? parseInt(a.id) || 0 : 0;
      const bId = typeof b.id === 'number' ? b.id : typeof b.id === 'string' ? parseInt(b.id) || 0 : 0;
      return bId - aId;
    });
    
    return trips;
  } catch (error: any) {
    console.error("Error fetching trips from /trips:", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    
    // If 400 Bad Request, backend might require query parameters
    // Try with empty query or different endpoint
    if (error.response?.status === 400) {
      try {
        // Try with limit parameter
        const response = await api.get<Trip[]>("/trips", {
          params: { limit: 100 }
        });
        const trips = Array.isArray(response.data) ? response.data : [];
        
        // Sort trips by most recent first (same logic as above)
        trips.sort((a, b) => {
          const aCreated = (a as any).createdAt || (a as any).created_at;
          const bCreated = (b as any).createdAt || (b as any).created_at;
          if (aCreated && bCreated) {
            return new Date(bCreated).getTime() - new Date(aCreated).getTime();
          }
          
          const aUpdated = (a as any).updatedAt || (a as any).updated_at;
          const bUpdated = (b as any).updatedAt || (b as any).updated_at;
          if (aUpdated && bUpdated) {
            return new Date(bUpdated).getTime() - new Date(aUpdated).getTime();
          }
          
          const aId = typeof a.id === 'number' ? a.id : typeof a.id === 'string' ? parseInt(a.id) || 0 : 0;
          const bId = typeof b.id === 'number' ? b.id : typeof b.id === 'string' ? parseInt(b.id) || 0 : 0;
          return bId - aId;
        });
        
        return trips;
      } catch (fallbackError: any) {
        console.error("Fallback also failed:", fallbackError);
        // Return empty array to prevent app crash
        return [];
      }
    }
    
    // For other errors, return empty array
    return [];
  }
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.post("/register", payload);
    return { success: true, ...response.data };
  } catch (error: any) {
    let message = "Registration failed";
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    return { success: false, message };
  }
}

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<{ success: boolean; message?: string; token?: string }> {
  try {
    const response = await api.post("/login", payload);
    
    // Try multiple possible token field names
    const token = response.data?.token || 
                  response.data?.accessToken || 
                  response.data?.access_token ||
                  response.data?.data?.token ||
                  response.data?.data?.accessToken;
    
    // Assume the backend returns a token and/or a success message
    return { 
      success: true, 
      token: token,
      ...response.data 
    };
  } catch (error: any) {
    console.error("Login error:", error);
    let message = "Sign-in failed";
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    return { success: false, message };
  }
}

export type CreateDestinationPayload = {
  name: string; // Will be sent as 'title' to backend
  description?: string;
  primaryImage?: File;
  additionalImages?: File[];
  tags?: string;
  latitude?: string | number;
  longitude?: string | number;
  authorId?: number;
};

export async function createDestination(payload: CreateDestinationPayload): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    // Get token first
    const AUTH_KEY = "authToken";
    const token = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    
    // Extract authorId using the same method as createUserTripWithFiles
    let authorId: number | undefined = payload.authorId;
    
    if (!authorId && token && token !== "__authenticated__") {
      // Helper function to extract authorId from token (copied from userTrips.ts logic)
      const extractAuthorIdFromToken = (token: string | null): number | null => {
        if (!token || token === "__authenticated__") {
          return null;
        }
        
        try {
          const parts = token.split(".");
          if (parts.length === 3 && parts[1]) {
            const decoded = atob(parts[1]);
            if (decoded) {
              const tokenPayload = JSON.parse(decoded);
              
              // Debug: Log token payload to see what fields are available
              console.log("Token payload:", tokenPayload);
              console.log("Token payload keys:", Object.keys(tokenPayload));
              
              // Try multiple possible field names for user ID
              const extractedId = tokenPayload.userId || 
                                  tokenPayload.id || 
                                  tokenPayload.user_id || 
                                  tokenPayload.authorId ||
                                  tokenPayload.sub ||
                                  tokenPayload.user?.id ||
                                  tokenPayload.userId ||
                                  tokenPayload.user?.userId;
              
              console.log("Extracted ID from token:", extractedId);
              
              if (extractedId) {
                const numId = Number(extractedId);
                if (!isNaN(numId)) {
                  return numId;
                } else {
                  console.warn("Extracted ID is not a number:", extractedId, typeof extractedId);
                }
              } else {
                console.warn("No ID field found in token payload. Available fields:", Object.keys(tokenPayload));
              }
            }
          } else {
            console.warn("Token is not a valid JWT format. Parts:", parts.length);
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
      
      // Try to extract authorId from token first
      const extractedId = extractAuthorIdFromToken(token);
      authorId = extractedId !== null ? extractedId : undefined;
      
      // If still no authorId, try to get from backend using email from token
      if (!authorId) {
        const email = extractEmailFromToken(token);
        if (email) {
          // Try multiple endpoints to get user by email
          const endpointsToTry = [
            `/users/email/${encodeURIComponent(email)}`,
            `/users?email=${encodeURIComponent(email)}`,
            "/auth/me",
            "/user/me",
          ];
          
          for (const endpoint of endpointsToTry) {
            try {
              const userResponse = await api.get(endpoint);
              const userInfo = userResponse.data;
              
              // Try to extract user ID from response
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
                authorId = Number(userId);
                console.log("Found authorId from backend:", authorId);
                break; // Success, stop trying other endpoints
              }
            } catch (error: any) {
              console.warn(`Failed to get user info from ${endpoint}:`, error.response?.status);
              // Continue to next endpoint
            }
          }
        }
      }
    }
    
    // Backend requires authorId - return error if not found
    if (!authorId) {
      return { 
        success: false, 
        message: "Cannot determine authorId. Please ensure you are logged in." 
      };
    }
    
    const formData = new FormData();
    
    // Backend expects 'title' not 'name'
    formData.append("title", payload.name);
    
    // Add authorId to FormData (REQUIRED by backend)
    formData.append("authorId", authorId.toString());
    
    if (payload.description) {
      formData.append("description", payload.description);
    }
    
    if (payload.primaryImage) {
      formData.append("primaryImage", payload.primaryImage);
    }
    
    if (payload.additionalImages && payload.additionalImages.length > 0) {
      payload.additionalImages.forEach((image) => {
        formData.append("additionalImages", image);
      });
    }
    
    if (payload.tags) {
      // Backend may expect tags as JSON array or comma-separated string
      // Try sending as JSON array first (like createUserTripWithFiles does)
      const tagsArray = payload.tags.split(",").map(t => t.trim()).filter(t => t);
      if (tagsArray.length > 0) {
        formData.append("tags", JSON.stringify(tagsArray));
      }
    }
    
    if (payload.latitude !== undefined && payload.latitude !== null && payload.latitude !== "") {
      formData.append("latitude", String(payload.latitude));
    }
    
    if (payload.longitude !== undefined && payload.longitude !== null && payload.longitude !== "") {
      formData.append("longitude", String(payload.longitude));
    }
    
    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, `(${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    
    // Try /trips endpoint first (same as createUserTripWithFiles)
    // If backend has separate /destinations endpoint, it will fail and we can adjust
    const response = await api.post("/trips", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return { 
      success: true, 
      message: response.data?.message || "Destination created successfully",
      data: response.data 
    };
  } catch (error: any) {
    console.error("Create destination error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    
    let message = "Failed to create destination";
    if (error.response && error.response.data) {
      // Try to get error message from various possible formats
      message = error.response.data.message || 
                error.response.data.error || 
                error.response.data.errors?.join?.(", ") ||
                JSON.stringify(error.response.data) ||
                message;
    }
    return { success: false, message };
  }
}