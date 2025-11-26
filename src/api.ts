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
